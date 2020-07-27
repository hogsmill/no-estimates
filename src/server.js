const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var dbStore = require('./store/dbStore.js')

var MongoClient = require('mongodb').MongoClient;

var prod = os.hostname() == "agilesimulations" ? true : false
var url = prod ?  "mongodb://127.0.0.1:27017/" : "mongodb://localhost:27017/"

var connectDebugOff = prod
var debugOn = !prod

var connections = {}
var maxConnections = 20

function emit(event, data, persist) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function loadGame(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.loadGame(err, client, db, io, data, debugOn)
  })
}

function restartGame(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.restartGame(err, client, db, io, data, debugOn)
  })
}

function updateRole(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateRole(err, client, db, io, data, debugOn)
  })
}

function updateCurrentDay(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateCurrentDay(err, client, db, io, data, debugOn)
  })
}

function updateCurrentEventCard(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateCurrentEventCard(err, client, db, io, data, debugOn)
  })
}

function updateCurrentWorkCard(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateCurrentWorkCard(err, client, db, io, data, debugOn)
  })
}

function updateColumns(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateColumns(err, client, db, io, data, debugOn)
  })
}

function updateDependentTeam(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateDependentTeam(err, client, db, io, data, debugOn)
  })
}

function updateEffort(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.updateEffort(err, client, db, io, data, debugOn)
  })
}

function addEffortToOthersCard(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.addEffortToOthersCard(err, client, db, io, data, debugOn)
  })
}

function incrementAutoDeploy(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.incrementAutoDeploy(err, client, db, io, data, debugOn)
  })
}

function startAutoDeploy(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.startAutoDeploy(err, client, db, io, data, debugOn)
  })
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

  socket.on("loadGame", (data) => { loadGame(data) })

  socket.on("restartGame", (data) => { restartGame(data) })

  socket.on("updateRole", (data) => { updateRole(data) })

  socket.on("showEventCard", (data) => { emit("showEventCard", data) })

  socket.on("updateCurrentEventCard", (data) => { updateCurrentEventCard(data) })

  socket.on("updateCurrentDay", (data) => { updateCurrentDay(data) })

  socket.on("updateCurrentWorkCard", (data) => { updateCurrentWorkCard(data) })

  socket.on("updateColumns", (data) => { updateColumns(data) })

  socket.on("updatePersonEffort", (data) => { emit("updatePersonEffort", data) })

  socket.on("updatePersonAutoDeployEffort", (data) => { emit("updatePersonAutoDeployEffort", data) })

  socket.on("updateEffort", (data) => { updateEffort(data) })

  socket.on("resetEffort", (data) => { emit("resetEffort", data) })

  socket.on("updateDependentTeam", (data) => { updateDependentTeam(data) })

  socket.on("addEffortToOthersCard", (data) => { addEffortToOthersCard(data) })

  socket.on("updateOtherTeamEffort", (data) => { emit("updateOtherTeamEffort", data) })

  socket.on("updateProjectEstimate", (data) => { emit("updateProjectEstimate", data) })

  socket.on("updateMVPEstimate", (data) => { emit("updateMVPEstimate", data) })

  socket.on("updateReEstimate", (data) => { emit("updateReEstimate", data) })

  socket.on("startAutoDeploy", (data) => { startAutoDeploy(data) })

  socket.on("incrementAutoDeploy", (data) => { incrementAutoDeploy(data) })

});

var port = process.argv[2] || 3007

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
