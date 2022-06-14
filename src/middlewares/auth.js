//middleware de autenticação
import { signupSchema, signinSchema } from "../schemas/authSchema.js";
import userRepository from "../repositories/userRepository.js"


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

export {validateSignup, validateSignin}