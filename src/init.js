let http = require('http')
let _ = require('lodash')
// let server = http.createServer(function (req, res) {
//   res.writeHead(200, {
//     'Content-Type': 'text/plain',
//   })
//   res.write('hello world')
//   res.end()
// })
let express = require('express')
    app = express()
    server = http.createServer(app);
    io = require('socket.io').listen(server)
    users = []
app.use('/', express.static(__dirname + '/../www/html'))
server.listen(800)
console.log('server started')

io.on('connection', function (socket) {
  socket.on('login', function (nickName) {
    if (users.includes(nickName)) {
      socket.emit('nickExisted')
    } else {
      socket.nickName =nickName
      users.push(nickName)
      socket.emit('loginSuccess')
      io.sockets.emit('system', nickName, users.length, 'login')
    }
  })
  socket.on('disconnect', function () {
    _.remove(users, (value) => value === socket.nickName)
    socket.broadcast.emit('system', socket.nickName, users.length, 'logout')
  })
  socket.on('postMsg', function (msg) {
    socket.broadcast.emit('newMsg', socket.nickName, msg)
  })
})
