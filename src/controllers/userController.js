import db from '../database.js';

export async function getUser (req, res) {
    const { id } = req.params;
    
    try {
        const checkUser = await db.query(`
            SELECT u."imageUrl", u.username, p.link, p.description, h.name AS hashtag
            FROM posts p
            JOIN users u ON p."userId" = u.id
            LEFT JOIN postsHashtags ph ON p.id = ph."postId"
            LEFT JOIN hashtags h ON ph."hashtagId" = h.id
            WHERE u.id = $1
        `, [id]);
        console.log(checkUser.rows);
        res.status(200).send(checkUser.rows);
    } catch (e) {
        console.log(`erro ao buscar usuario: ${e}`);
        res.sendStatus(500);
    }
}

export async function searchUser (req, res) {
    const { user } = req.params;
    
    try {
        const checkUser = await db.query(`SELECT u.id, u.username, u."imageUrl" FROM users u WHERE username ILIKE $1`, [`%${user}%`]);
        console.log(checkUser.rows);
        res.status(200).send(checkUser.rows);
    } catch (e) {
        console.log(`erro ao buscar usuario: ${e}`);
        res.sendStatus(500);
    }
}