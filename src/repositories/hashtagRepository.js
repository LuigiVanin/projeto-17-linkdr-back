import db from "../database.js";

const getHashtagsByName = async (hashtagName) => {
    return db.query(
        `
        SELECT count(l.id) as "likesCount", p.description, p.link, p.id as "postId", u.username, u.email, u."imageUrl", u.id as "userId"
        FROM posts p
        JOIN users u ON p."userId" = u.id
        JOIN "postsHashtags" ph ON ph."postId" = p.id
        JOIN hashtags h ON h.id = ph."hashtagId" 
        LEFT JOIN likes l ON p.id = l."postId"
        WHERE h.name = $1
        GROUP BY p.id, p.description, p.link, u.username, u.email, u."imageUrl", u.id
    `,
        [`#${hashtagName}`]
    );
};

const getTrendingHashtags = async () => {
    return db.query(
        `
        SELECT h.name, count(p.id) as "frequency" FROM hashtags h
        JOIN "postsHashtags" ph ON ph."hashtagId" = h.id
        JOIN posts p on p.id = ph."postId" 
        GROUP BY h.name
        ORDER BY "frequency" DESC
        LIMIT 10
        `
    );
};

export { getHashtagsByName, getTrendingHashtags };
