import db from '../database.js';

export async function getUser (req, res) {
    const { id } = req.params;
    
    try {
        const checkUser = await db.query(`
            SELECT u."imageUrl", u.username, p.link, p.description, h.name AS hashtag
            FROM posts p
            JOIN users u ON p."userId" = u.id
            LEFT JOIN "postsHashtags" ph ON p.id = ph."postId"
            LEFT JOIN hashtags h ON ph."hashtagId" = h.id
            WHERE u.id = $1
        `, [id]);
        const userById = await db.query(`SELECT username AS name FROM users WHERE id=$1`,[id]);
        const obj = {
            name: userById.rows[0].name,
            posts: checkUser.rows
        }
        res.status(200).send(obj);
    } catch (e) {
        console.log(`erro ao buscar usuario: ${e}`);
        res.sendStatus(500);
    }
}

export async function searchUser (req, res) {
    const { user } = res.locals;
    const { search } = req.params;
    
    try {
        let usersList = [];
        let usersIdList = [];
        const checkUser = await db.query(`
        SELECT u.id, u.username, u."imageUrl", f."userId" FROM users u
        LEFT JOIN followers f ON u.id = f."friendId"
        WHERE u.username ILIKE $1
        ORDER BY f."userId" != $2
        `, [`%${search}%`,user.id]);
        
        checkUser.rows.forEach(userObj => {
            if(!usersIdList.includes(userObj.id)) {
                usersIdList.push(userObj.id);
                usersList.push(userObj);
            }
        });
        res.status(200).send(usersList);
    } catch (e) {
        console.log(`erro ao buscar usuario: ${e}`);
        res.sendStatus(500);
    }
}