import  'dotenv/config.js'
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import {createServer} from 'node:http';
import { ChatModel } from "../model.js";


const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
// socket server 
// socket server creado
const io = new Server(server, {
  connectionStateRecovery: {}
})
// log de peticiones
app.use(morgan('dev'))
//recibimos las conexciones
io.on('connection', async (socket) => {
  console.log('a user has connected!');  

  // inicio de chart para guardar los mensajes en base de datos y crear persistencia
  socket.on('chat message', async (msg) => {
    const username = socket.handshake.auth.username ?? 'anonymous'
    const result = await ChatModel.saveMessage(msg, username)
    // emitimos los mensajes a todos los clientes que se conecten para que todos vean el chat
    io.emit('chat message', msg , result.toString(), username)
  })

  socket.on('disconnect', () => {
    console.log(`an user has disconnected`);
  })

  // comprobamos si el cliente tiene conexcion
  if (!socket.recovered) {
    try {
      // recuperamos el ultimo mensaje
      const offSet = socket.handshake.auth.serverOffset ?? 0
      // consultamos los mensjaes en la base de datos
      const result = await ChatModel.getMessage(offSet)
      //recorremos los resultados y los mostramos a todos los clientes
      result.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    } catch (error) {
      console.error(error)
    }
  }

})




app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port,() => {
  console.log(`server running on port ${port}`);
})