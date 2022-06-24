import postSchema from "../schemas/postSchema.js";

function validatePost(req, res, next) {

    const {link, description} = req.body;

    const validate = postSchema.validate({
        link: link,
        description: description
    });
    if (validate.error) return res.sendStatus(400);

    next();
}

export default validatePost;