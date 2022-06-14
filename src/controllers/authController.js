import bcrypt from 'bcrypt'
import db from "../database.js";

async function signup(req, res){
    const user = req.body 
    const {username, email, password, imageUrl} = user
    try {
        const passwordHash = bcrypt.hashSync(password, 10);

        await db.query(`
                                  INSERT INTO 
                                  users(username, email, password, "imageUrl") 
                                  VALUES ($1, $2, $3, $4)`, [username, email, passwordHash, imageUrl])
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export {signup}