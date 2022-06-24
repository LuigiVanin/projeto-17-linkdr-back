import {
    createCommentOnPost,
    getCommentsFromPost,
    getPostById,
} from "../repositories/commentRepository.js";

const createComment = async (req, res) => {
    const { description, postId } = req.body;
    const { user } = res.locals;
    console.log(user);
    try {
        const post = await getPostById(postId);
        if (!post.rowCount) {
            return res
                .status(404)
                .send({ details: "Não há posts com esse Id!" });
        }
        await createCommentOnPost(description, postId, user.userId);
        return res
            .status(201)
            .send({ details: "comentário criado com sucesso!" });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await getCommentsFromPost(postId);
        return res.status(200).send(comments.rows);
    } catch (err) {
        console.log(err);
        return res.senStatus(500);
    }
};

export { createComment, getCommentsByPost };
