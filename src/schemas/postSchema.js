import joi from "joi";

const postSchema = joi.object({
    link: joi.string().required(),
    description: joi.string()
});

export default postSchema;