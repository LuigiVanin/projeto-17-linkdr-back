import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

import joi from "joi";
import db from "./database.js";

app.post("/post", async (req, res) => {

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
});

app.get("/timeline", (req, res) => {

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
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Aberta na porta ${PORT}`);
});