var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var session = require('express-session');
app.use(session({secret: 'cash_positive',
    resave: true,
    saveUninitialized: true
}));

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://pranjal:pranjal123@ds223609.mlab.com:23609/mongo');

var User = require('./app/models/users');
var Message = require('./app/models/messages');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// API Routes
var router = express.Router();
app.use('/', router);

router.use(function(req, res, next) {
  console.log('Processing...');
  next();
});


router.get("/", (req, res) => {
res.sendFile(__dirname + "/app/index.html");
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

    User.findOne({$and: [{userName: user_name },{ password: pass }] }).exec(function(err,user) {
      if (err) {
        res.send(err);
      }
      else if(user){
         req.session.userName = 'pranjal.jn97' ;
      res.json({message: 'LoggedIn successfully !'});
      }
      else if(!user)
      {
      	res.json({message: 'Invalid Credentials/No User !'});
      }
    });
  })

  router.route('/sendmessage')
  .post(function(req, res) {

    if(req.session.userName){
    var msg = new Message(); 
    msg.subject = req.body.sub;
    msg.content = req.body.con;
    msg.touser = req.body.touser;
    msg.byuser = req.session.userName;

    msg.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Message Sent!'});
    });
  }
    else{
      res.json({message: 'Not Authorized!'});
    }
});


  router.get("/inbox", (req, res) => {
if(req.session.userName){
Message.find({ touser : req.session.userName }).exec(function(err,msg) {
      if (err) {
        res.send(err);
      }
      else if(msg){
      res.json(msg);
      }
      else if(!msg)
      {
        res.json({message: 'No messages found !'});
      }
    });

} 
else 
{
 res.json({message: 'Not Authorized!'}); 
}
});


  router.route('/block/:user')
  .put(function(req, res) {
     if(req.session.userName)
     {
    req.session.blocked.push(req.params.user);
    res.json({message: 'User blocked!'});
   
     }
  });




app.listen(port, () => {
  console.log("Server listening on port " + port);
});

  

