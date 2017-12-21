var express = require('express');
var app = express();
var mongo = require('mongodb');
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;

//connect to database
var database = require('./config/database');
var url = database.url;

MongoClient.connect(url, function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log('Connection to MongoDB successful.')
    db.listCollections().toArray(function(err, result) {
      if (err) throw err;
      db.close();
    })
  }
});

//TODO probably need to connect to the API of the MS2

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // print log to console using nodemon
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/angular'));
app.use('/js', express.static(__dirname + '/node_modules/angular-animate'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
// ionicons will be requested from the CDN
// app.use('/css', express.static(__dirname + '/node_modules/ionicons-npm/css'));
// app.use('/css/fonts', express.static(__dirname + '/node_modules/ionicons-npm/fonts'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/@uirouter/angularjs/release'));

require('./app/routes')(app);

app.listen(8080);
console.log("App listening on port 8080");
