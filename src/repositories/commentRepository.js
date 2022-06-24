import db from "../database.js";

const createCommentOnPost = async (description, postId, userId) => {
    await db.query(
        `
        INSERT INTO "comments" ("description", "postId", "userId")
        VALUES ($1, $2, $3)
        `,
        [description, postId, userId]
    );
};

const getPostById = async (postId) => {
    return db.query(
        `
    SELECT * FROM "posts"
    WHERE id =  $1
    `,
        [postId]
    );
};

const getCommentsFromPost = async (postId) => {
    return db.query(
        `
        SELECT c.description, c.id as "commentId" ,u.username, u."imageUrl", u.id as "userId" 
        FROM posts p
        JOIN "comments" c on c."postId" = p.id
        JOIN users u on u.id = c."userId"
        WHERE p.id = $1;
        `,
        [postId]
    );
};

export { createCommentOnPost, getPostById, getCommentsFromPost };