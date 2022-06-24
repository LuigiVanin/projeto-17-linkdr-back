import {
    validToken,
    checkLike,
    likePostId,
    dislikePostId,
    countLikes,
    getLikeName

} from "../repositories/postsRepository.js";


export async function likePost(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();
    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);
        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        const vLike = await checkLike(parseInt(user.rows[0].id), parseInt(postId))

        if (vLike.rowCount > 0) {
            console.log("voce descurtiu o post");
            await dislikePostId(parseInt(user.rows[0].id), parseInt(postId));
        }
        else {
            console.log("voce curtiu o post");
            await likePostId(parseInt(user.rows[0].id), parseInt(postId));
        }

        res.status(200).send(vLike);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getLiked(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);

        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const vLike = await checkLike(parseInt(user.rows[0].id), parseInt(postId))

        res.status(200).send([vLike.rowCount > 0, 50]);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getLikes(req, res) {
    const { postId } = req.params;
    try {
        const result = await countLikes(parseInt(postId));
        res.status(200).send(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getNames(req, res) {
    const { postId } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ error: 'Token não encontrado' });
    }
    try {
        const user = await validToken(token);

        if (!user.rows[0]) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        const result = await getLikeName(parseInt(postId));
        const names = result.rows.map(user => user.username);

        let UserLike = false
        if (names.indexOf(user.rows[0].username) > -1) {
            UserLike = true
            names.splice(names.indexOf(user.rows[0].username), 1)
            names.push(user.rows[0].username)
        }
        if (names.length === 0) {
            res.status(200).send("Seja o primeiro a curtir!");
        }
        else {
            if (names.length === 1 && UserLike) {
                res.status(200).send(`Você curtiu!`);
            }
            else if (names.length === 1 && !UserLike) {
                res.status(200).send(`${names[0]} curtiu!`);
            }
            else if (names.length === 2 && UserLike) {
                res.status(200).send(`Você e ${names[0]} curtiram!`);
            }
            else if (names.length === 2 && !UserLike) {
                res.status(200).send(`${names[0]} e ${names[1]} curtiram!`);
            }
            else if (names.length >= 3 && UserLike) {
                res.status(200).send(`Você, ${names[0]} e outras ${names.length - 2} curtiram!`);
            }
            else if (names.length >= 3 && !UserLike) {
                res.status(200).send(`${names[0]}, ${names[1]} e outras ${names.length - 2} curtiram!`);
            }
        }
    }
    catch (err) { 
        console.log(err);
        return res.sendStatus(500);
    }
}