import { tokenSchema } from "../schemas/authSchema.js";
import userRepository from "../repositories/userRepository.js";

const authentication = async (req, res, next) => {
    let { authorization: token } = req.headers;

    const validation = tokenSchema.validate(token);
    if (validation.error) {
        return res
            .status(401)
            .send(validation.error.details.map((i) => i.message));
    }
    token = token.replace("Bearer", "").trim();
    
    try {
        const user = await userRepository.getUserBySession(token);
        if (!user.rowCount) {
            return res.status(401).send({ message: "Token Inválido" });
        }
        res.locals.user = user.rows[0];
        console.log("AUTENTICADO!");
        next();
        
    } catch (err) {
        console.log(err);
        if (err.name === "error" && err.table) {
            return res.status(422).send({ details: err.detail });
        }
        return res.send(500);
    }
};

export default authentication;
