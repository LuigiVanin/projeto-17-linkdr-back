import database from '../database.js';

export async function likePost(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    

}

export async function unlikePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

export async function editPost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    const { userId } = req.body;
}

