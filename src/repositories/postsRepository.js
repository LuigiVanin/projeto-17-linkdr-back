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
        DELETE FROM "postsHastags" WHERE "postId" = $1
        `,
        [postId]
    );
}

const deletePostId = async (postId) => {
    return db.query(
        `
        DELETE FROM posts WHERE id = $1
        `,
        [postId]
    );
}



export { validToken, updatePost, checkLike, likePostId, dislikePostId, countLikes, getLikeName, checkAuthor, deleteLikesId, deleteHashtagId, deletePostId };