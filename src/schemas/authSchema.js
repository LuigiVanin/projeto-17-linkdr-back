import joi from "joi";

const signupSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    imageUrl: joi.string().uri().required(),
});

const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

const tokenSchema = joi
    .string()
    .pattern(/^Bearer /)
    .required();

export { signupSchema, signinSchema, tokenSchema };