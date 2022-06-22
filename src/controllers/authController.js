import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import userRepository from "../repositories/userRepository.js";

async function signup(req, res) {
    const user = req.body;
    const { username, email, password, imageUrl } = user;
    try {
        const passwordHash = bcrypt.hashSync(password, 10);

        await userRepository.createUser(
            username,
            email,
            passwordHash,
            imageUrl
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function signin(req, res) {
    const { email, password } = req.body;
    try {
        const { rows: users } = await userRepository.getUserByEmail(email);
        const [user] = users;
        if (!user) return res.sendStatus(401);

        const passwordValidation = bcrypt.compareSync(password, user.password);
        if (passwordValidation) {
            const token = uuid();
            await userRepository.createSession(token, user.id);
            return res.send({ token, userId: user.id });
        } else return res.sendStatus(422);
    } catch (error) {
        res.sendStatus(500);
    }
}

export { signup, signin };
