import db from '../database.js';
import { createPostHashtag, findHashtag, insertHashtag } from '../repositories/hashtagRepository.js';
import {
    validToken, updatePost, checkAuthor,
    deleteLikesId, deleteHashtagId, 
    deletePostId, insertPost, getLastPostId , deleteReposts, getAllReposts
} from "../repositories/postsRepository.js";
import { formatHashtags } from './hashtagController.js';

export async function createPost(req, res) {

    const { user } = res.locals;
    const {link, description} = req.body;

    try {
        await insertPost(user.id, link, description);
        const lastPostId = await getLastPostId(user.id);
        const hashtags = formatHashtags(description);

        for (let hashtag of hashtags) {
            if (hashtag) {
                await insertHashtag(hashtag);
                const hashtagId = await findHashtag(hashtag);
                await createPostHashtag(lastPostId, hashtagId);
            }
        }
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function updateUserPost(req, res) {

    const { user } = res.locals;
    const { postId } = req.params;
    const { description } = req.body;
    

    try {
        await updatePost(description, user.id, postId);
        const hashtags = formatHashtags(description);
        for(let hashtag of hashtags){
            if (hashtag){ 
                await insertHashtag(hashtag);
                const hashtagId = await findHashtag(hashtag);
                await createPostHashtag(postId, hashtagId);
            }
        }
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getPosts(req, res) {
    const { user } = res.locals;
    
    try {
        let limit = '';
        let offset = '';
        if (req.query.limit) limit = `LIMIT ${req.query.limit}`;
        if (req.query.offset) offset = `OFFSET ${req.query.offset}`;

        /*const resultPosts = await db.query(`
            SELECT posts.id as "postId", users.id as "userId", users."imageUrl", users.username, posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
            FROM posts
            JOIN users ON posts."userId" = users.id
            LEFT JOIN likes ON likes."postId" = posts.id
            JOIN followers ON posts."userId" = followers."friendId"
            GROUP BY users.id, users.username, posts.id, "postCreationDate"
            ORDER BY "postCreationDate" DESC
            ${limit}
            ${offset}
        `);*/

        const resultPosts = await db.query(`
            SELECT posts.id as "postId", users.id as "userId", users."imageUrl", users.username, posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
            FROM posts
            JOIN users ON posts."userId" = users.id
            LEFT JOIN likes ON likes."postId" = posts.id
            GROUP BY users.id, users.username, posts.id, "postCreationDate"
            ORDER BY "postCreationDate" DESC
            ${limit}
            ${offset}
        `);

        const resultReposts = await getAllReposts();
        const resultConcat = resultPosts.rows.concat(resultReposts.rows)

        function compare(a,b) {
            if (a.postCreationDate < b.postCreationDate)
               return 1;
            if (a.postCreationDate > b.postCreationDate)
              return -1;
            return 0;
          }

        const total = resultConcat.sort(compare);


        const posts = total.map((post)=>{
           return {...post, isOwner: parseInt(post.userId) === user.id}
        });

        res.send(posts);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
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
        await deleteHashtagId(parseInt(postId));
        await deleteReposts(parseInt(postId));
        await deletePostId(parseInt(postId));
        res.status(200).send("Post deletado com sucesso!");
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getRepost(req, res){
    const { postId } = req.params;
    try{
        const result = await db.query(`
        SELECT * FROM reposts WHERE "postId" = $1`, [postId])
        res.status(200).send(result)
    }
    catch{
        console.log(err);
        return res.sendStatus(500);
    }

}

export async function postRepost(req,res){
    const {userId,postId,userPost } = req.body;
    console.log(userId, postId, userPost)
    try{
        const result = await db.query(`
        insert into reposts ("userId", "postId", "userPosted") values ($1, $2, $3)`,[userId, postId, userPost]
        );

        res.status(200).send(result)

    }
    catch{
        console.log(err);
        return res.sendStatus(500);
    }
}