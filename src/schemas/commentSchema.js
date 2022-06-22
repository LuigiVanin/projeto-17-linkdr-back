import Joi from "joi";

const commentSchema = Joi.object({
    description: Joi.string().required(),
    postId: Joi.number().integer().required(),
});

export default commentSchema;
