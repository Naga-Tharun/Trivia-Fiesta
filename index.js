const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const http = require('http');
const socketIO = require('socket.io');

require('dotenv').config();

mongoose.set('strictQuery', true);
mongoose
  .connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@trivia-backend.ghh8fdo.mongodb.net/`, { useNewUrlParser: true })
  .then((data) => console.log("server is connected to mongodb"))
  .catch((err) => console.log(err));
const app = express();
// app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIO(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});
module.exports = { io };
const socketPort = process.env.SOCKET_PORT || 8082;

server.listen(socketPort, () => {
  console.log(`server is up and running on ${socketPort}`);
});

app.use("/", require("./routes"));

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is up and running on ${port}`);
});
