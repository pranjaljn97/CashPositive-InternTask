var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codealong');

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




app.listen(port, () => {
  console.log("Server listening on port " + port);
});

  

