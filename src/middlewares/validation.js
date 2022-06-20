import { signupSchema, signinSchema } from "../schemas/authSchema.js";
import userRepository from "../repositories/userRepository.js"
import db from '../database.js';

async function validateSignup(req, res, next){
    const user = req.body // username, email, password, imageUrl
    const {email} = user
    const validation = signupSchema.validate(user)
    if(validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        const existingUsers = await userRepository.existingUsers(email)
        if (existingUsers.rowCount > 0) return res.status(422).send("Usuário já existente.")
        next()
    } catch (error) {
        console.log('Problema ao consultar usuário: ', error)
    }
}

async function validateSignin(req, res, next){
    const credentials = req.body // email, password
    const validation = signinSchema.validate(credentials)
    if(validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))
    next()
}

async function validateToken(req, res, next){
    const authorization  = req.headers.authorization
    const token = authorization?.replace("Bearer ", "")
    if(!token) return res.status(403).send("Token não enviado")

    const { rows: sessions } = await db.query(`SELECT * 
        FROM sessions 
        WHERE token=$1`,
        [token]
    )
    const [session] = sessions
    if (!session) return res.status(401).send("Sessão de usuário não encontrada")
    
    const { rows: users } = await db.query(`
        SELECT * 
        FROM users 
        WHERE id=$1`, 
        [session.userId]
    )
    const [user] = users
    if (!user) return res.status(401).send("Usuário não encontrado")

    res.locals.user = user;
    next();
}
export {validateSignup, validateSignin, validateToken}