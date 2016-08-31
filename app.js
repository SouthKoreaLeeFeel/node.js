var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(methodOverride("_method"));

app.get('/posts',function(req,res){
  Post.find({}).sort('-createdAt').exec(function(err,posts){
    if(err) return res.json({success:false, message:err});
    res.render("posts/index",{data:posts});
  });
});

//new
app.get('/posts/new',function(req,res){
    res.render("posts/new");
});
//create
app.post('/posts', function(req,res) {
  console.log(req.body);
  Post.create(req.body.post, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.redirect("/posts");
  });
});

//show
app.get('/posts/:id', function (req,res) {
  Post.findById(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data:post});
  });
});

//edit
app.get('/posts/:id/edit', function (req,res) {
  Post.findById(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/edit", {data:post});
  });
});

//update
app.put('/posts/:id', function(req,res) {
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts/'+req.params.id);
  });
});

//delete
app.delete('/posts/:id', function(req,res) {
  Post.findByIdAndRemove(req.params.id, function(err,post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
    //res.json({success:true, message:post._id+" deleted"});
  });
});

app.set("view engine",'ejs');

app.listen(3000, function(){
  console.log('Server On!');
});
