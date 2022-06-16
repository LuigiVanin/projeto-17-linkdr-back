import db from "../database.js";

const getHashtagsByName = async (hashtagName) => {
    return db.query(
        `
        SELECT count(l.id) as "likesCount", p.description, p.link, p.id as "postId", u.username, u.email, u."imageUrl"
        FROM posts p
        JOIN users u ON p."userId" = u.id
        JOIN likes l ON p.id = l."postId"
        JOIN "postsHashtags" ph ON ph."postId" = p.id
        JOIN hashtags h ON h.id = ph."hashtagId" 
        WHERE h.name = $1
        GROUP BY p.id, p.description, p.link, u.username, u.email, u."imageUrl"
    `,
        [`#${hashtagName}`]
    );
};

export { getHashtagsByName };
