import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL
};

if(process.env.MODE === "PROD") {
  configDatabase.ssl = {
    rejectUnauthorized: false
  }
}
const db = new Pool(configDatabase);

/* conexao db para teste local:-----------------
const db = new Pool({
  host: process.env.HOST,
  port: process.env.SQL_PORT,
  user: 'postgres',
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
/---------------------------------------------*/ 

export default db;