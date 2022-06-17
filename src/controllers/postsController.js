import db from '../database.js';

export async function createPost(req, res) {

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(403);

    const {link, description} = req.body;

    try {
        const resultSession = await db.query(`SELECT * FROM sessions WHERE token = ${token}`);
        const session = result.rows[0];
        if(!session) return res.send(401);

        const resultUser = await db.query(`SELECT * FROM users WHERE id = ${session.userId}`);
        const user = resultUser.rows[0];
        if (!user) return res.sendStatus(401);
    
        const postSchema = joi.object({
            link: joi.string().required(),
            description: joi.string()
        });

        const validate = postSchema.validate({
            link: link,
            description: description
        });
        if (validate.error) return res.sendStatus(400);

        await db.query(`INSERT INTO posts ($1, $2, $3, NOW())`, [user.id, link, description]);
        return res.status(200).send("Post publicado com sucesso!");

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getPosts(req, res) {

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(403);

    try {
        const resultSession = await db.query(`SELECT * FROM sessions WHERE token = ${token}`);
        const session = result.rows[0];
        if(!session) return res.send(401);

        const resultUser = await db.query(`SELECT * FROM users WHERE id = ${session.userId}`);
        const user = resultUser.rows[0];
        if (!user) return res.sendStatus(401);

        const limit = '';
        const offset = '';

        if (req.query.limit) limit = `LIMIT ${req.query.limit}`;
        if (req.query.offset) offset = `OFFSET ${req.query.offset}`; 

        const resultPosts = await db.query(`
            SELECT users."imageURL", users.username, posts.link, posts.description, hashtags.name as hashtag
            FROM posts
            JOIN users ON post."userId" = users.id
            JOIN postsHashtags ON posts.id = postsHashtags."postId"
            JOIN hashtags ON postsHashtags."hashtagId" = hashtags.id
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
    try{
        const user = await db.query(`SELECT users.*, sessions.token FROM users JOIN sessions ON users.id = sessions."userId" 
        WHERE sessions.token = $1`, [token]);
        
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const vLike = await db.query(`SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`, [parseInt(user.rows[0].id), parseInt(postId)]);
        
        if (vLike.rowCount > 0) {
            console.log("voce descurtiu o post");
            await db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2`, [parseInt(user.rows[0].id), parseInt(postId)]);
        }
        else{
            console.log("voce curtiu o post");
            await db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2)`, [parseInt(user.rows[0].id), parseInt(postId)]);
        }
        
        res.status(200).send(vLike);
    }
    catch(err){
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
    try{
        const user = await db.query(`SELECT users.*, sessions.token FROM users JOIN sessions ON users.id = sessions."userId"
        WHERE sessions.token = $1`, [token]);
      
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const vLike = await db.query(`SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`, [parseInt(user.rows[0].id), parseInt(postId)]);
       
        res.status(200).send([vLike.rowCount>0,50]);
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getLikes(req, res) {
    const { postId } = req.params;
    try{ 
         const result = await db.query(`SELECT COUNT("postId") FROM likes WHERE "postId" = $1`, [parseInt(postId)]);
      
         res.status(200).send(result.rows[0]);
    }
    catch(err){
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
    try{
        const user = await db.query(`SELECT users.*, sessions.token FROM users JOIN sessions ON users.id = sessions."userId"
        WHERE sessions.token = $1`, [token]);
      
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const result = await db.query(`SELECT users.username FROM users
        JOIN likes ON users.id = likes."userId"
        WHERE likes."postId" = $1`, [parseInt(postId)]);
    
        const names = result.rows.map(user => user.username);
      
        let UserLike = false
        if(names.indexOf(user.rows[0].username) > -1){
            UserLike = true
            names.splice(names.indexOf(user.rows[0].username), 1)
            names.push(user.rows[0].username)
        }
        if (names.length === 0){
            res.status(200).send("Seja o primeiro a curtir!");
        }
        else{
            if(names.length === 1 && UserLike){
                res.status(200).send(`Você curtiu!`);
            }
            else if(names.length === 1 && !UserLike){
                res.status(200).send(`${names[0]} curtiu!`);
            }
            else if(names.length === 2 && UserLike){
                res.status(200).send(`Você e ${names[0]} curtiram!`);
            }
            else if(names.length === 2 && !UserLike){
                res.status(200).send(`${names[0]} e ${names[1]} curtiram!`);
            }
            else if(names.length >= 3 && UserLike){
                res.status(200).send(`Você, ${names[0]} e outras ${names.length - 2} curtiram!`);
            }
            else if(names.length >= 3 && !UserLike){
                res.status(200).send(`${names[0]}, ${names[1]} e outras ${names.length - 2} curtiram!`);
            }

        }

        // res.status(200).send(result.rows);
}
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

