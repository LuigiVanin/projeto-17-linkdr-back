import db from '../database.js';

export async function getUser (req, res) {
    const { id } = req.params;
    
    try {
        const checkUser = await db.query(`
            SELECT posts.id as "postId", users.id as "userId", users."imageUrl", users.username, posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
            FROM posts
            JOIN users ON posts."userId" = users.id
            LEFT JOIN likes ON likes."postId" = posts.id
            GROUP BY users.id, users.username, posts.id, "postCreationDate"
            ORDER BY "postCreationDate" DESC
            WHERE u.id = $1
        `, [id]);
        const userById = await db.query(`SELECT username AS name FROM users WHERE id=$1`,[id]);
        const obj = {
            name: userById.rows[0].name,
            posts: checkUser.rows
        }
        return res.status(200).send(obj);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function searchUser (req, res) {
    const { user } = req.params;
    
    try {
        const checkUser = await db.query(`
            SELECT u.id, u.username, u."imageUrl" 
            FROM users u 
            WHERE username ILIKE $1`,
            [`%${user}%`]
        );
        console.log(checkUser.rows);
        return res.status(200).send(checkUser.rows);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function checkFriends(req, res) {

    const { user } = res.locals;

    try {
        const friends = await db.query(`
            SELECT * FROM followers 
            JOIN users ON followers."userId" = users.id
            WHERE users.id = $1 
        `, [user.id]);  
        let result = false; 

        if (friends.rowCount > 0) result = true;

        return res.status(200).send(result);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}