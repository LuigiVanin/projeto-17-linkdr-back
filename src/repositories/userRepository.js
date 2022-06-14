//repositório para usário
import db from '../database.js'


async function createUser(username, email, passwordHash, imageUrl){
    return db.query(
        ` 
        INSERT INTO 
        users(username, email, password, "imageUrl") 
        VALUES ($1, $2, $3, $4)
        `, 
    [username, email, passwordHash, imageUrl])
}

async function existingUsers(email){
    return db.query( 
        `
        SELECT * 
        FROM users 
        WHERE email=$1
        `, 
        [email])
}

const userRepository = {
    createUser,
    existingUsers
}

export default userRepository