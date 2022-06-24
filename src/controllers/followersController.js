import db from '../database.js';

export async function insertFollower(req, res) {
    const { user } = res.locals;
    const { followerId } = req.params;

    try {
        await db.query(`INSERT INTO "followers" ("userId", "friendId") VALUES ($1, $2)`, [user.id, followerId]);
        res.sendStatus(201);
    } catch (e) {
        console.log(`erro ao inserir seguidor: ${e}`);
        res.sendStatus(500);
    }
}

export async function removeFollower(req, res) {
    const { user } = res.locals;
    const { followerId } = req.params;

    try {
        await db.query(`DELETE FROM "followers" WHERE "userId" = $1 AND "friendId" = $2`, [user.id, followerId]);
        res.sendStatus(200);
    } catch (e) {
        console.log(`erro ao remover seguidor: ${e}`);
        res.sendStatus(500);
    }
}