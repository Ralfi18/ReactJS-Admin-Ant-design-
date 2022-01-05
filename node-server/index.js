const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const options = { cors: { origin: "*" } };
const io = new Server(server, options);

app.get("/", (req, res) => {
	res.send("<h1>TEST SERVER</h1>");
});

io.on("connection", (socket) => {
	console.log("new connection");
  	socket.on("disconnect", (reason) => {
  		console.log(reason)
  	});	
});


server.listen(8080, () => {
	console.log( "listen on port *:8080" );
});

// const options = { cors: { origin: "*" } };
// const io = require("socket.io")(options);
// io.on("connection", (socket) => {
// 	console.log("connection", socket.id)
// });
// io.listen(8080);


// const httpServer = require("http").createServer();
// const options = { /* ... */ };
// const io = require("socket.io")(httpServer, options);
// io.on("connection", socket => { /* ... */ });
// httpServer.listen(3000);