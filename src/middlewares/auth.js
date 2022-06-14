//middleware de autenticação
import db from "../database.js";
import { signupSchema } from "../schemas/authSchema.js";


async function validateSignup(req, res, next){
    const user = req.body // username, email, password, imageUrl
    const {email} = user
    const validation = signupSchema.validate(user)
    if(validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        const existingUsers = await db.query( `
                                            SELECT * 
                                            FROM users 
                                            WHERE email=$1`, [email])
        if (existingUsers.rowCount > 0) return res.status(422).send("Usuário já existente.")
        next()
    } catch (error) {
        console.log('Problema ao consultar usuário: ', error)
    }
}

export {validateSignup}