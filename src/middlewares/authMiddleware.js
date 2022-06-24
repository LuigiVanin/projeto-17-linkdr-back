//middleware de autenticação

import db from '../database.js';
import { tokenSchema, signupSchema, signinSchema } from "../schemas/authSchema.js";
import userRepository from "../repositories/userRepository.js";

async function authentication (req, res, next) {
    const {authorization} = req.headers;

    const validation = tokenSchema.validate(authorization);
    if (validation.error) return res.status(403);

    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) return res.sendStatus(401);

    try {
        const user = await userRepository.getUserBySession(token);
        if (!user.rowCount) return res.sendStatus(401);

        res.locals.user = user.rows[0];
        next();

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function validateSignup(req, res, next){

    const {email} = req.body;
    const validation = signupSchema.validate(req.body);

    if(validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const existingUser = await userRepository.existingUsers(email);
        if (existingUser.rowCount > 0) return res.sendStatus(409);

        next();
        
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function validateSignin(req, res, next){

    const validation = signinSchema.validate(req.body);
    if(validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    next(); 
}

export { authentication, validateSignup, validateSignin };