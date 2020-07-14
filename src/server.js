const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var prod = os.hostname() == "agilesimulations" ? true : false

var connectDebugOff = prod
var debugOn = !prod

var connections = {}
var maxConnections = 20

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

io.on("connection", (socket) => {
  var connection = socket.handshake.headers.host
  connections[connection] = connections[connection] ? connections[connection] + 1 : 1
  if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
  }

  socket.on("disconnect", () => {
    var connection = socket.handshake.headers.host
    connections[connection] = connections[connection] - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
  })

  socket.on("addTeamName", (data) => { emit("addTeamName", data) })

  socket.on("updateRole", (data) => { emit("updateRole", data) })

  socket.on("showEventCard", (data) => { emit("showEventCard", data) })

  socket.on("updateCurrentEventCard", (data) => { emit("updateCurrentEventCard", data) })

  socket.on("updateCurrentDay", (data) => { emit("updateCurrentDay", data) })

  socket.on("updateCurrentWorkCard", (data) => { emit("updateCurrentWorkCard", data) })

  socket.on("updateColumns", (data) => { emit("updateColumns", data) })

  socket.on("updatePersonEffort", (data) => { emit("updatePersonEffort", data) })

  socket.on("updateEffort", (data) => { emit("updateEffort", data) })

  socket.on("updateQueues", (data) => { emit("updateQueues", data) })

  socket.on("resetEffort", (data) => { emit("resetEffort", data) })

  socket.on("updateDependentTeam", (data) => { emit("updateDependentTeam", data) })
});

var port = process.argv[2] || 3007

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
