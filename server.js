var express = require('express');
var fs = require("fs")
var app = express(); 
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

/** Serving from the same express Server
No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());  

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        console.log(req.file);
        if(err){
                res.json({error_code:1,err_desc:err});
                return;
        }
            res.json({error_code:0,err_desc:null});
    });
});

app.get("/filenames", function(req,res){
    files = fs.readdirSync('uploads')
    res.json({"files":files});
})

app.use('/pdf', express.static("uploads"));

app.use('/download', function(req,res) {
  var file = 'uploads/'+req.query.filename;
  res.download(file);
});

app.listen('3001', function(){
    console.log('running on 3001...');
});