import db from '../database.js';

import { createPostHashtag, findHashtag, insertHashtag } from '../repositories/hashtagRepository.js';
import joi from "joi";


import {
    validToken,
    updatePost,
    checkLike,
    likePostId,
    dislikePostId,
    countLikes,
    getLikeName,
    checkAuthor,
    deleteLikesId,
    // deleteHashtagId,
    deletePostId

} from "../repositories/postsRepository.js";
import { formatHashtags } from './hashtagController.js';

export async function createPost(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(403);


    const {link, description} = req.body;
    const hashtags = description.split("#");
    console.log(hashtags);

    try {
        const resultSession = await db.query(`SELECT * FROM sessions WHERE token = '${token}'`);
        const session = resultSession.rows[0];
        if(!session) return res.send(401);


        const resultUser = await db.query(`SELECT * FROM users WHERE id = ${session.userId}`);
        const user = resultUser.rows[0];
        if (!user) return res.sendStatus(401);


        const postSchema = joi.object({
        await db.query(`
            INSERT INTO posts ("userId", link, description) 
            VALUES ($1, $2, $3)
        `, [user.id, link, description]);

        const resultPost = await db.query(`
            SELECT * FROM posts WHERE "userId" = ${session.userId} 
            ORDER BY id DESC
            LIMIT 1;
        `);
        const post = resultPost.rows[0];
        console.log(post);

        for (let [index, hashtag] of hashtags.entries()) {
            if (index !== 0) {

                let resultHashtag = await db.query(`
                    SELECT * FROM hashtags 
                    WHERE name = $1
                `, [hashtag]);

                if (resultHashtag.rowCount === 0) {
                    await db.query(`
                        INSERT INTO hashtags (name) VALUES ($1);
                    `, [hashtag]);
                    resultHashtag = await db.query(`
                        SELECT * FROM hashtags WHERE name = $1;
                    `, [hashtag]);
                }

                const hashtagId = resultHashtag.rows[0].id;
                console.log(hashtagId);
                await db.query(`
                    INSERT INTO "postsHastags" ("hashtagId", "postId") VALUES ($1, $2);
                `, [hashtagId, post.id])
            }
        }
    
        /*const postSchema = joi.object({

            link: joi.string().required(),
            description: joi.string()
        });

        const validate = postSchema.validate({
            link: link,
            description: description
        });
        if (validate.error) return res.sendStatus(400);*/

        return res.send("tudo ok");

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function updateUserPost(req, res) {
    const { user } = res.locals
    const { postId } = req.params
    const { description } = req.body
    
    try {
        await updatePost(description, user.id, postId)
        const hashtags = formatHashtags(description)
        for(let hashtag of hashtags){
            if (hashtag){ 
                await insertHashtag(hashtag)
                const hashtagId = await findHashtag(hashtag)
                await createPostHashtag(postId, hashtagId)
            }
           
        }
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function getPosts(req, res) {

    /*
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(403);
    */

    try {
        /*
        const resultSession = await db.query(`SELECT * FROM sessions WHERE token = ${token}`);
        const session = result.rows[0];
        if(!session) return res.send(401);
      

        const resultUser = await db.query(`SELECT * FROM users WHERE id = ${session.userId}`);
        const user = resultUser.rows[0];
        if (!user) return res.sendStatus(401);
        */

        let limit = '';
        let offset = '';

        if (req.query.limit) limit = `LIMIT ${req.query.limit}`;
        if (req.query.offset) offset = `OFFSET ${req.query.offset}`;
        /*


        const resultPosts = await db.query(`
            SELECT users."imageUrl", users.username, posts.link, posts.description, hashtags.name as hashtag
            FROM posts
            JOIN users ON posts."userId" = users.id
            JOIN "postsHashtags" ON posts.id = "postsHashtags"."postId"
            JOIN hashtags ON "postsHashtags"."hashtagId" = hashtags.id
            ${limit}
            ${offset}
        `);
        
        */


        const resultPosts = await db.query(`
        SELECT users."imageUrl", users.username, posts."userId" as "ownerId", posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
        FROM posts
        JOIN users ON posts."userId" = users.id
        LEFT JOIN likes 
        ON likes."postId" = posts.id
        GROUP BY users."imageUrl", users.username, "ownerId", posts.link, posts.description, "postCreationDate"
        ORDER BY "postCreationDate" DESC  
        ${limit}
        ${offset}
        `);
        return res.send(resultPosts.rows.reverse());

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function likePost(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();
    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        const vLike = await checkLike(parseInt(user.rows[0].id), parseInt(postId))

        if (vLike.rowCount > 0) {
            console.log("voce descurtiu o post");
            await dislikePostId(parseInt(user.rows[0].id), parseInt(postId));
        }
        else {
            console.log("voce curtiu o post");
            await likePostId(parseInt(user.rows[0].id), parseInt(postId));
        }

        res.status(200).send(vLike);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getLiked(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);

        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const vLike = await checkLike(parseInt(user.rows[0].id), parseInt(postId))

        res.status(200).send([vLike.rowCount > 0, 50]);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getLikes(req, res) {
    const { postId } = req.params;
    try {
        const result = await countLikes(parseInt(postId));
        res.status(200).send(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getNames(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);

        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        const result = await getLikeName(parseInt(postId));
        const names = result.rows.map(user => user.username);

        let UserLike = false
        if (names.indexOf(user.rows[0].username) > -1) {
            UserLike = true
            names.splice(names.indexOf(user.rows[0].username), 1)
            names.push(user.rows[0].username)
        }
        if (names.length === 0) {
            res.status(200).send("Seja o primeiro a curtir!");
        }
        else {
            if (names.length === 1 && UserLike) {
                res.status(200).send(`Você curtiu!`);
            }
            else if (names.length === 1 && !UserLike) {
                res.status(200).send(`${names[0]} curtiu!`);
            }
            else if (names.length === 2 && UserLike) {
                res.status(200).send(`Você e ${names[0]} curtiram!`);
            }
            else if (names.length === 2 && !UserLike) {
                res.status(200).send(`${names[0]} e ${names[1]} curtiram!`);
            }
            else if (names.length >= 3 && UserLike) {
                res.status(200).send(`Você, ${names[0]} e outras ${names.length - 2} curtiram!`);
            }
            else if (names.length >= 3 && !UserLike) {
                res.status(200).send(`${names[0]}, ${names[1]} e outras ${names.length - 2} curtiram!`);
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        const result = await checkAuthor(parseInt(postId));
        if (parseInt(result.rows[0].userId) !== parseInt(user.rows[0].id)) {
            return res.status(401).json({ error: 'Você não tem permissão para deletar esse post' });
        }
        await deleteLikesId(parseInt(postId));
        // await deleteHashtagId(parseInt(postId));
        await deletePostId(parseInt(postId));
        res.status(200).send("Post deletado com sucesso!");
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

