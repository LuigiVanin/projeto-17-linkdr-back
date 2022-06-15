import db from '../database.js';

export async function getUser (req, res) {
    const { id } = req.params;
    
    try {
        const checkUser = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        console.log(checkUser.rows);
        res.status(200).send(checkUser.rows);
    } catch (e) {
        console.log(`erro ao buscar usuario: ${e}`);
        res.sendStatus(500);
    }
}