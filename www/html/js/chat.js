window.onload = function () {
  let chat = new Chat()
  chat.init()
}

let Chat = function () {
  this.socket = null
}

Chat.prototype = {
  init: function () {
    let that = this
    this.socket = io.connect()
    this.socket.on('connect', function () {
      document.getElementById('info').textContent = 'get yourself a nickname :)'
      document.getElementById('nickWrapper').style.display = 'block'
      document.getElementById('nicknameInput').focus()

      document.getElementById('loginBtn').addEventListener('click', function () {
        let nickName = document.getElementById('nicknameInput').value
        if (nickName.trim().length !== 0) {
          that.socket.emit('login', nickName)
        } else {
          document.getElementById('nickNameInput').focus()
        }
      }, false)

      document.getElementById('sendBtn').addEventListener('click', function () {
        let messageInput = document.getElementById('messageInput'),
            msg = messageInput.value;
        messageInput.value = '';
        messageInput.focus();
        if (msg.trim().length > 0) {
          that.socket.emit('postMsg', msg); //把消息发送到服务器
          that._displayNewMsg('me', msg); //把自己的消息显示到自己的窗口中
        }
      }, false)
    })

    this.socket.on('nickExisted', function () {
      document.getElementById('info').textContent = '!nickname is taken, choose another pls'
    })

    this.socket.on('loginSuccess', function() {
      document.title = 'chat | ' + document.getElementById('nicknameInput').value;
      document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
      document.getElementById('messageInput').focus();//让消息输入框获得焦点
    })

    this.socket.on('system', function (nickName, userCount, type) {
      let msg = nickName + ' ' + (type === 'login' ? 'joined' : 'left')
      let p = document.createElement('p')
      p.textContent = msg
      document.getElementById('historyMsg').appendChild(p)
      document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online'
    })

    this.socket.on('newMsg', function (user, msg) {
      that._displayNewMsg(user, msg)
    })
  },

  _displayNewMsg: function(user, msg, color) {
    let container = document.getElementById('historyMsg'),
      msgToDisplay = document.createElement('p'),
      date = new Date().toTimeString().substr(0, 8);
    msgToDisplay.style.color = color || '#000';
    msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
    container.appendChild(msgToDisplay);
    container.scrollTop = container.scrollHeight;
  }
}


