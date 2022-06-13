import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(`Aberta na porta ${PORT}`);
});
