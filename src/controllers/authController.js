import bcrypt from 'bcrypt'
import userRepository from '../repositories/userRepository.js'

async function signup(req, res){
    const user = req.body 
    const {username, email, password, imageUrl} = user
    try {
        const passwordHash = bcrypt.hashSync(password, 10)

        await userRepository.createUser(username, email, passwordHash, imageUrl)
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export {signup}