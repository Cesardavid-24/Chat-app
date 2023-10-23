import mysql from 'mysql2/promise'
// conexion a la base de datos 
const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

export async function connectDb() {
  try {
    const connection = await mysql.createConnection(connectionString) 
    console.log(`conexion exitosa`);
    return connection
    
  } catch (error) {
    console.log(`error al conectar la base de datos` + error);
    throw error
  }
   
} 