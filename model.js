import { connectDb } from "./db/connection.js";

const conn = await connectDb()

await conn.execute('CREATE TABLE IF NOT EXISTS messages (id INT PRIMARY KEY AUTO_INCREMENT, content TEXT, user TEXT); ')

export class ChatModel {

  static async getMessage (offSet) {
    try {
      const [result] = await conn.execute('SELECT id, content, user FROM messages WHERE id > ?', [offSet])

      return result

    } catch (error) {
      console.error(error)
    }
  }

  static async saveMessage (message, username) { 
    try {
      const result = await conn.execute('INSERT INTO messages (content, user) VALUES (?,?)', [message, username])
      return result.lastIndexOf()
    } catch (error) {
      console.error(error)
      return
    }
  }
  
} 