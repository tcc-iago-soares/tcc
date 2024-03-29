import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";

const path = require('path');
const fs = require('fs');
const http = require('http');

const options = {
  //key: fs.readFileSync('/etc/letsencrypt/live/iago.boidacarapreta.cc/privkey.pem'),
  //cert: fs.readFileSync('/etc/letsencrypt/live/iago.boidacarapreta.cc/fullchain.pem')  
};

export class Server {
 private httpServer: HTTPServer;
 private app: Application;
 private io: SocketIOServer;
 
 private readonly DEFAULT_PORT = 5050;
 
 constructor() {
   this.initialize();
 
   this.handleRoutes();
   this.handleSocketConnection();
 }
 
 private initialize(): void {
   this.app = express();
   this.httpServer = http.createServer(options,this.app);
   this.io = socketIO(this.httpServer);

   this.configureApp();
   this.handleSocketConnection();
 }

 private handleRoutes(): void {
   this.app.get("/", (req, res) => {
     res.send(`<h1>Hello World</h1>`); 
   });
 }
 
 private handleSocketConnection(): void {
   this.io.on("connection", socket => {
     console.log("Socket connected.");
   });
 }
 
 public listen(callback: (port: number) => void): void {
   this.httpServer.listen(this.DEFAULT_PORT, () =>
     callback(this.DEFAULT_PORT)
   );
 }

 private configureApp(): void {
   this.app.use(express.static(path.join(__dirname, "../public")));
 }
}

