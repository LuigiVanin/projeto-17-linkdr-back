import db from "../database.js";

const validToken = async (token) => {
    return db.query(
        `
        SELECT users.*, sessions.token FROM users JOIN sessions ON users.id = sessions."userId" 
        WHERE sessions.token = $1
        `,
        [token] 
    );
}

const insertPost = async (userId, link, description) =>{
    return db.query(
        `
        INSERT INTO posts ("userId", link, description) 
        VALUES ($1, $2, $3)
        `, 
        [userId, link, description]);
}

const getLastPostId = async (userId) =>{
    const query = await db.query(
        `
        SELECT * FROM posts WHERE "userId" = $1
        ORDER BY id DESC
        LIMIT 1;
        `, [userId])
    return query.rows[0].id
}

const updatePost = async (description, userId, postId) => {
    
    return db.query(
        `
        UPDATE posts 
        SET description = $1
        WHERE posts.id = $2 AND posts."userId" = $3

        `, 
        [description, postId, userId])
}

const checkLike = async (userId, postId) => {
    return db.query(
        `
        SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`,
        [userId, postId]
    );
}

const likePostId = async (userId, postId) => {
    return db.query(
        `
        INSERT INTO likes ("userId", "postId") VALUES ($1, $2)
        `,
        [userId, postId]
    );
}

const dislikePostId = async (userId, postId) => {
    return db.query(
        `
        DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2
        `,
        [userId, postId]
    );
}

const countLikes = async (postId) => {
    return db.query(
        `
        SELECT COUNT("postId") FROM likes WHERE "postId" = $1
        `,
        [postId]
    );
}

const getLikeName = async (postId) => {
    return db.query(
        `
        SELECT users.username FROM users
        JOIN likes ON users.id = likes."userId"
        WHERE likes."postId" = $1
        `,
        [postId]
    );
}

const checkAuthor = async (postId) => {
    return db.query(
        `
        SELECT "userId" FROM posts WHERE id = $1
        `,
        [postId]
    );
}

const deleteLikesId = async (postId) => {
    return db.query(
        `
        DELETE FROM likes WHERE "postId" = $1
        `,
        [postId]
    );
}

const deleteHashtagId = async (postId) => {
    return db.query(
        `
        DELETE FROM "postsHashtags" WHERE "postId" = $1
        `,
        [postId]
    );
}

const deleteReposts = async (postId) =>{
    return db.query(`
    DELETE FROM reposts WHERE "postId" = $1
    `,
    [postId])
}

const deletePostId = async (postId) => {
    return db.query(
        `
        DELETE FROM posts WHERE id = $1
        `,
        [postId]
    );
}

const getAllReposts = async () => {
    return db.query(`
    select reposts."postId", reposts."userPosted" as "userId", aut."imageUrl" ,posts.link, posts.description, aut.username as username, users.username as "sharedBy", reposts."createdAt" as "postCreationDate", COUNT(likes.id) as "likesCount"
    from reposts
    join posts on posts.id = reposts."postId"
    join users aut on aut.id = reposts."userPosted"
    join users on users.id = reposts."userId"
    left join likes on likes."postId" = reposts."postId"
    GROUP BY reposts."postId", reposts."userPosted", aut."imageUrl" ,posts.link, posts.description, aut.username, users.username, reposts."createdAt"
    ORDER BY "postCreationDate" DESC
    `)
}



export { validToken, insertPost, getLastPostId, updatePost, checkLike, likePostId, dislikePostId, countLikes, getLikeName, checkAuthor, deleteLikesId, deleteHashtagId, deleteReposts, deletePostId, getAllReposts };