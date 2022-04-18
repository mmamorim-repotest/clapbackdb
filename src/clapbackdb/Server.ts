import express from "express";
import cors from "cors"
import { Server } from "socket.io";
import Database from "./Database";

export default async function initServer(port: any, db: Database) {

    const app = express();
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    const http = require('http');
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    app.get('/', function (req, res) {
        db.get(req,res);
    });
    app.post('/', function (req, res) {
        db.post(req,res);
    });

    server.listen(port, () => {
        console.log(`listening on *:${port}`);
    });

    return io;
}

