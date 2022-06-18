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
        SELECT users."imageUrl", users.username, posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
        FROM posts
        JOIN users ON posts."userId" = users.id
        LEFT JOIN likes 
        ON likes."postId" = posts.id
        GROUP BY users."imageUrl", users.username, posts.link, posts.description, "postCreationDate"
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
        console.log(token);
        if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try{
        const user = await db.query(`SELECT users.*, sessions.token FROM users JOIN sessions ON users.id = sessions."userId" 
        WHERE sessions.token = $1`, [token]);
        console.log(user.rows[0]);
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const vLike = await db.query(`SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`, [parseInt(user.rows[0].id), parseInt(postId)]);
        console.log(vLike.rowCount);
        if (vLike.rowCount > 0) {
            console.log("voce descurtiu o post");
            await db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2`, [parseInt(user.rows[0].id), parseInt(postId)]);
        }
        else{
            console.log("voce curtiu o post");
            await db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2)`, [parseInt(user.rows[0].id), parseInt(postId)]);
        }
         // contador de likes    
        //  const result = await db.query(`SELECT COUNT("postId") FROM likes WHERE "postId" = $1`, [parseInt(postId)]);
        //  res.status(200).json({ likes: result.rows[0]});
        res.status(200).send("Like alterado com sucesso!");

       
    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
    

    

}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

