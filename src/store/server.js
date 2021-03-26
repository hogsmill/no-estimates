
const fs = require('fs')
const ps = require('ps-node')

const restartPassword = 'gNM5ZJ<N}kZr$V-E'

function doLog(logFile, s) {
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
}

function restartServer(logFile) {
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
        const logFile = process.arguments.reverse()[0]
        if (port == '3007' && logFile.match(/no-estimates.log/)) {
          doLog(logFile, '-------------------------- Restarting Server ----------------------------')
          ps.kill(pid, function(err) {
            if (err) {
              throw new Error(err)
            } else {
              doLog(logFile, 'Process %s has been killed!', pid)
              doLog(logFile, '-------------------------- Server Restarted -----------------------------')
            }
         })
        }
      }
    })
  })
}

module.exports = {

  checkServerRestartPassword: function(db, io, data, logFile, debugOn) {

    if (debugOn) { console.log('checkServerRestartPassword <data hidden>') }

    if (data == restartPassword) {
      restartServer(logFile)
    } else {
      io.emit('serverRestartPasswordError')
    }
  }
}
