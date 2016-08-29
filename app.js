var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');


mongoose.connect("mongodb://test:1234@ds019076.mlab.com:19076/southkorea");
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});

db.on("error", function(err){
  console.log("DB ERROR :", err);
});

/*
var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data',dataSchema);

Data.findOne({name:"myData"},function(err,data){
  if(err){ return console.log("Data ERROR :  " ,err);}
  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      if(err) return console.log("Data ERROR",err);
      console.log("Counter initialized : ",data);
    });
  }

});

app.get('/',function (req,res){
  res.send('Hello World!');
});
*/
app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname + '/public')));
console.log(__dirname);
var data={count:0};

app.get('/', function (req,res){
  data.count++;
  res.render('my_first_ejs',data);
});

app.get('/reset', function (req,res){
  data.count=0;
  res.render('my_first_ejs',data);
});

app.get('/set/count', function (req,res){
console.log('req.query.count : ' +req.query.count);
  if (req.query.count) {
    data.count = req.query.count;
  }
  res.render('my_first_ejs',data);
});

app.get('/set/:num', function (req,res){
  data.count=req.params.num;
  res.render('my_first_ejs',data);
});

app.listen(3000, function(){
  console.log('Server On!');
});
