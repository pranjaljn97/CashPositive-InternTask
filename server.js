var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://pranjal:pranjal123@ds223609.mlab.com:23609/mongo');

var User = require('./app/models/users');
//var Message = require('./app/models/messages');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// API Routes
var router = express.Router();
app.use('/', router);

router.use(function(req, res, next) {
  console.log('FYI...There is some processing currently going down...');
  next();
});

// Test Route
router.get("/", (req, res) => {
res.sendFile(__dirname + "/app/index.html");
//res.json({message: 'Welcome to our API!'});
});

router.route('/register')
  .post(function(req, res) {
    var user = new User(); 
    user.firstName = req.body.fname;
    user.lastName = req.body.lname;
    user.userName = req.body.uname;
    user.password = req.body.pwd;

    user.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'User is successfully registered!'});
    });
  });

  router.route('/login')
  .post(function(req, res) {
    
   
   var user_name = req.body.uname;
   var pass = req.body.pwd;

    User.findOne({$and: [{userName: user_name },{ password: pass}] }).exec(function(err,user) {
      if (err) {
        res.send(err);
      }
      else if(user){
      res.json({message: 'LoggedIn successfully !'});
      }
      else
      {
      	res.json({message: 'Invalid Credentials/No User !'});
      }
    });
  });

 //router.get("/inbox", (req, res) => {

  
//res.json({message: 'Welcome to our API!'});
//});


app.listen(port, () => {
  console.log("Server listening on port " + port);
});

  

