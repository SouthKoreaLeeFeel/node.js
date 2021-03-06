var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//mongoose.connect("mongodb://test:1234@ds019076.mlab.com:19076/southkorea");
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});

db.on("error", function(err){
  console.log("DB ERROR :", err);
});

//model setting
var postSchema = mongoose.Schema({
  title : {type : String, require : true},
  body : {type : String, require : true},
  createdAt : {type : Date, default : Date.now},
  updatedAt : Date
});

var Post = mongoose.model('post',postSchema);

app.get('/posts',function(req,res){
  Post.find({}, function(err,posts){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:posts});
  });
});

//create
app.post('/posts', function(req,res) {
  console.log(req);
  Post.create(req.body.post, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});

//show
app.get('/posts/:id', function (req,res) {
  Post.findById(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});

//update
app.put('/posts/:id', function(req,res) {
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });
});

//delete
app.delete('/posts/:id', function(req,res) {
  Post.findByIdAndRemove(req.params.id, function(err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" deleted"});
  });
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data',dataSchema);

Data.findOne({name:"myData"},function(err,data){
  if(err) return console.log("Data ERROR :  " ,err);

  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      if(err) return console.log("Data ERROR",err);
      console.log("Counter initialized : ",data);
    });
  }

});
/*
app.get('/',function (req,res){
  res.send('Hello World!');
});
*/
app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname + '/public')));

//console.log(__dirname);
//var data={count:0};
app.get('/', function (req,res){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("Data ERROR :  " ,err);
    data.count++;
    data.save(function (err){
      if(err) return console.log("Data ERROR :  " ,err);
        res.render('my_first_ejs',data);
    });
  });
});

app.get('/reset', function (req,res){
  data.count=0;
  res.render('my_first_ejs',data);
});

app.get('/set/count', function (req,res){
  //console.log('req.query.count : ' +req.query.count);
  //if (req.query.count) data.count = req.query.count;
  //res.render('my_first_ejs',data);
  if(req.query.count) setCounter(res,req.query.count);
  else getCount(res);
});

app.get('/set/:num', function (req,res){
  //data.count=req.params.num;
  //res.render('my_first_ejs',data);
  if(req.prams.num) setCounter(res,req.prams.num);
  else getCount(res);
});

function setCounter(res,num) {
  console.log("setCounter");
  Data.findOne({name:"myData"},function (err,data){
    if(err) return console.log("Data ERROR: ",err);
    data.count = num;
    data.save(function (err){
      if(err) return console.log("Data ERROR : ",err);
      res.render('my_first_ejs',data);
    });
  });
}

function getCounter(res,num) {
  console.log("getCounter");
  Data.findOne({name:"myData"},function (err,data){
    if(err) return console.log("Data ERROR: ",err);
    res.render('my_first_ejs',data);
  });
}

app.listen(3000, function(){
  console.log('Server On!');
});
