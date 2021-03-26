
const fs = require('fs')
const ps = require('ps-node')

const restartPassword = 'gNM5ZJ<N}kZr$V-E'

const logFile = '/usr/apps/logs/server.log'

function doLog(s) {
  fs.appendFile(logFile, s, function (err) {
    if (err) console.log(s)
    process.exit()
  })
}

function restartServer() {
  ps.lookup({
    command: 'node'
  },
  function(err, resultList ) {
    if (err) {
      throw new Error( err )
    }
    resultList.forEach(function(process) {
      if (process) {
        const pid = process.pid
        const port = process.arguments[1]
        const logF = process.arguments.reverse()[0]
        if (port == '3007' && logF.match(/no-estimates.log/)) {
          doLog('---- Restarting No Estimates Server ----')
          ps.kill(pid, function(err) {
            if (err) {
              doLog(logFile, err)
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

  checkServerRestartPassword: function(db, io, data, debugOn) {

    if (debugOn) { console.log('checkServerRestartPassword <data hidden>') }

    if (data == restartPassword) {
      restartServer()
    } else {
      io.emit('serverRestartPasswordError')
    }
  }
}
