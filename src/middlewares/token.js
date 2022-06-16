import db from '../database.js';

export async function validToken (req, res, next) {
    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    if (!token) return res.sendStatus(403);
    console.log(token);

    try {
        const checkToken = await db.query('SELECT * FROM sessions WHERE token = $1', [token]);
        if (checkToken.rows.length === 0) return res.status(401).send('Token invalido');
    } catch (e) {
        console.log(`erro ao validar token: ${e}`);
        res.sendStatus(500);
    }

    next();
}