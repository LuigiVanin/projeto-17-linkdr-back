//repositório para usário
import db from "../database.js";

async function createUser(username, email, passwordHash, imageUrl) {
    return db.query(
        ` 
        INSERT INTO 
        users(username, email, password, "imageUrl") 
        VALUES ($1, $2, $3, $4)
        `,
        [username, email, passwordHash, imageUrl]
    );
}

async function existingUsers(email) {
    return db.query(
        `
        SELECT * 
        FROM users 
        WHERE email=$1
        `,
        [email]
    );
}

async function getUserByEmail(email) {
    return db.query(
        `
        SELECT * from users u
        WHERE u.email = $1
        `,
        [email]
    );
}

async function createSession(token, id) {
    return db.query(
        `
        INSERT INTO sessions (token, "userId") 
        VALUES ($1, $2)
        `,
        [token, id]
    );
}

async function getUserBySession(token) {
    return db.query(
        `
    SELECT users.username, users.id as "userId", "imageUrl" FROM sessions
    JOIN users ON sessions."userId" = users.id
    WHERE sessions.token = $1;
    `,
        [token]
    );
}

const userRepository = {
    createUser,
    existingUsers,
    createSession,
    getUserByEmail,
    getUserBySession,
};

export default userRepository;
