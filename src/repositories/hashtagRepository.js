import db from "../database.js";

const getHashtagsByName = async (hashtagName) => {
    return db.query(
        `
    SELECT p.description, p.link, p.id as "postId", h.name, u.username, u.email, u."imageUrl"
    FROM hashtags h
    JOIN "postsHashtags" ph ON h.id = ph."hashtagId"
    JOIN posts p ON p.id = ph."postId"
    JOIN users u ON p."userId" = u.id
    WHERE h.name = $1    
    `,
        [`#${hashtagName}`]
    );
};

export { getHashtagsByName };
