
const fs = require('fs')
const ps = require('ps-node')

const restartPassword = 'gNM5ZJ<N}kZr$V-E'

const serverLog = '/usr/apps/logs/server.log'

function doLog(s) {
  fs.appendFile(serverLog, s, function (err) {
    if (err) console.log(s)
    process.exit()
  })
}

function restartServer(logFile) {
  ps.lookup({
    command: 'node'
  },
  function(err, resultList) {
    if (err) {
      throw new Error(err)
    }
    resultList.forEach(function(process) {
      if (process) {
        const pid = process.pid
        const port = process.arguments[1]
        const logF = process.arguments.reverse()[0]
        if (port == port && logF.match(logFile)) {
          doLog('---- Restarting No Estimates Server ----')
          ps.kill(pid, function(err) {
            if (err) {
              doLog(err)
              throw new Error(err)
            } else {
              doLog('Process %s has been killed!', pid)
              doLog('---- Server Restarted ----')
            }
         })
        }
      }
    })
  })
}

module.exports = {

  checkServerRestartPassword: function(db, io, data, logFile, port, debugOn) {

    if (debugOn) { console.log('checkServerRestartPassword <data hidden>', logFile, port) }

    if (data == restartPassword) {
      restartServer(logFile, port)
    } else {
      io.emit('serverRestartPasswordError')
    }
  }
}
