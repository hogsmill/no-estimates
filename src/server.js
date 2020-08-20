const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var dbStore = require('./store/dbStore.js')

var MongoClient = require('mongodb').MongoClient;

var prod = os.hostname() == "agilesimulations" ? true : false
var url = prod ?  "mongodb://127.0.0.1:27017/" : "mongodb://localhost:27017/"

var connectDebugOff = prod
var debugOn = false // !prod

var connections = {}
var maxConnections = 20

function emit(event, data, persist) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');

    switch(fun) {
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break;
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break;
      case 'updateTeamName':
        dbStore.updateTeamName(err, client, db, io, data, debugOn)
        break;
      case 'updateRole':
        dbStore.updateRole(err, client, db, io, data, debugOn)
        break;
      case 'changeName':
        dbStore.changeName(err, client, db, io, data, debugOn)
        break;
      case 'updateCurrentDay':
        dbStore.updateCurrentDay(err, client, db, io, data, debugOn)
        break;
      case 'updateCurrentEventCard':
        dbStore.updateCurrentEventCard(err, client, db, io, data, debugOn)
        break;
      case 'updateCurrentWorkCard':
        dbStore.updateCurrentWorkCard(err, client, db, io, data, debugOn)
        break;
      case 'updateCommit':
        dbStore.updateCommit(err, client, db, io, data, debugOn)
        break;
      case 'updateColumns':
        dbStore.updateColumns(err, client, db, io, data, debugOn)
        break;
      case 'updateDependentTeam':
        dbStore.updateDependentTeam(err, client, db, io, data, debugOn)
        break;
      case 'updateEffort':
        dbStore.updateEffort(err, client, db, io, data, debugOn)
        break;
      case 'updateAssignedEffort':
        dbStore.updateAssignedEffort(err, client, db, io, data, debugOn)
        break;
      case 'addEffortToOthersCard':
        dbStore.addEffortToOthersCard(err, client, db, io, data, debugOn)
        break;
      case 'incrementAutoDeploy':
        dbStore.incrementAutoDeploy(err, client, db, io, data, debugOn)
        break;
      case 'startAutoDeploy':
        dbStore.startAutoDeploy(err, client, db, io, data, debugOn)
        break;
      case 'updateProjectEstimate':
        dbStore.updateProjectEstimate(err, client, db, io, data, debugOn)
        break;
      case 'updateMVPEstimate':
        dbStore.updateMVPEstimate(err, client, db, io, data, debugOn)
        break;
      case 'updateReEstimate':
        dbStore.updateReEstimate(err, client, db, io, data, debugOn)
        break;
      case 'pairingDay':
        dbStore.pairingDay(err, client, db, io, data, debugOn)
        break;

      // Facilitator
      //
      case 'percentageBlocked':
        dbStore.percentageBlocked(err, client, db, io, data, debugOn)
        break;
      case 'percentageDeployFail':
        dbStore.percentageDeployFail(err, client, db, io, data, debugOn)
        break;
      case 'updateTeamActive':
        dbStore.updateTeamActive(err, client, db, io, data, debugOn)
        break;

      default:
        console.log("Unknown function: '" + fun + "'")
    }
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

  socket.on("loadGame", (data) => { doDb('loadGame', data) })

  socket.on("restartGame", (data) => { doDb('restartGame', data) })

  socket.on("updateTeamName", (data) => { doDb('updateTeamName', data) })

  socket.on("updateRole", (data) => { doDb('updateRole', data) })

  socket.on("changeName", (data) => { doDb('changeName', data) })

  socket.on("showEventCard", (data) => { emit("showEventCard", data) })

  socket.on("updateCurrentEventCard", (data) => { doDb('updateCurrentEventCard', data) })

  socket.on("updateCurrentDay", (data) => { doDb('updateCurrentDay', data) })

  socket.on("updateCommit", (data) => { doDb('updateCommit', data) })

  socket.on("updateCurrentWorkCard", (data) => { doDb('updateCurrentWorkCard', data) })

  socket.on("updateColumns", (data) => { doDb('updateColumns', data) })

  socket.on("updateAssignedEffort", (data) => { doDb('updateAssignedEffort', data) })

  socket.on("updatePersonEffort", (data) => { emit("updatePersonEffort", data) })

  socket.on("updatePersonAutoDeployEffort", (data) => { emit("updatePersonAutoDeployEffort", data) })

  socket.on("updateEffort", (data) => { doDb('updateEffort', data) })

  socket.on("pairingDay", (data) => { doDb('pairingDay', data) })

  socket.on("resetEffort", (data) => { emit("resetEffort", data) })

  socket.on("updateDependentTeam", (data) => { doDb('updateDependentTeam', data) })

  socket.on("addEffortToOthersCard", (data) => { doDb('addEffortToOthersCard', data) })

  socket.on("updateOtherTeamEffort", (data) => { emit("updateOtherTeamEffort", data) })

  socket.on("updateProjectEstimate", (data) => { doDb('updateProjectEstimate', data) })

  socket.on("updateMVPEstimate", (data) => { doDb('updateMVPEstimate', data) })

  socket.on("updateReEstimate", (data) => { doDb('updateReEstimate', data) })

  socket.on("startAutoDeploy", (data) => { doDb('startAutoDeploy', data) })

  socket.on("incrementAutoDeploy", (data) => { doDb('incrementAutoDeploy', data) })

  // Facilitator View

  socket.on("percentageBlocked", (data) => { doDb('percentageBlocked', data) })

  socket.on("percentageDeployFail", (data) => { doDb('percentageDeployFail', data) })

  socket.on("updateTeamActive", (data) => { doDb('updateTeamActive', data) })

});

var port = process.argv[2] || 3007

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
