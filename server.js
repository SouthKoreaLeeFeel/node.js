var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var flash = require('connect-flash');


app.use(express.static(path.join(__dirname + '/public')));
app.use(flash());
app.set("view engine",'ejs');

app.get("/chatClient",function(req, res){
  res.render("chatClient");
});

io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var name = setUserName();
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(){
    var msg = name + ' 様が出かけました。';
    console.log('user disconnected: ', socket.id);
    io.emit('receive message', msg);
  });

  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);
  });
});

http.listen('3100', function(){
  console.log(" chatClient server on!");
});

var StringBuffer = function() {
    this.buffer = [];
};
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};

function setUserName()
{
    var bName = new StringBuffer();
    var iNameSize = 2;

    for(var i = 0; i < iNameSize; i++){
        var ch = String.fromCharCode((Math.random() * 11172) + 0xAC00);
        bName.append(ch);
        //this.sUserName = bName.toString();
    }
    return bName.toString();
}
