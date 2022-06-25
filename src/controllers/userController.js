import db from '../database.js';

export async function getUser (req, res) {
    const { id } = req.params;
    
    try {
        const checkUser = await db.query(`
            SELECT posts.id as "postId", users.id as "userId", users."imageUrl", users.username, posts.link, posts."createdAt" as "postCreationDate", posts.description, COUNT(likes.id) as "likesCount"
            FROM posts
            JOIN users ON posts."userId" = users.id
            LEFT JOIN likes ON likes."postId" = posts.id
            WHERE users.id = $1
            GROUP BY users.id, users.username, posts.id, "postCreationDate"
            ORDER BY "postCreationDate" DESC
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