var MongoClient = require('mongodb').MongoClient;
var database = require('../config/database');
var url = database.url;
var ObjectId = require('mongodb').ObjectId;
var path = require('path');

// These routes specify the HTTP communition between the frontend and
// the mongo database. For every sent request the application awaits the
// correspondig response. The application's frontend works then with the
// received data further

module.exports = function(app) {

  // Get all lists from a specific user.
  // Since you can't send parameters via a GET request, I use a simple query
  // As response's data I get an array with all the user's lists
  app.get('/api/lists', function(req, res) {

    let username = req.query.username;

    if(username !== undefined){
      // connect to the database
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // search for lists with a username
        db.collection("lists").find({
          user : username
         }).toArray(function(err, result) {
          if (err) throw err;
          //send the result as json object
          res.json(result);
          db.close();
        })
      });
    }
  });

  // Get a single list by ID
  app.get('/api/lists/:listID', function(req, res) {

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var id = new ObjectId(req.params.listID);
      db.collection("lists").find({
        _id: id
      }).toArray(function(err, result) {
        if (err) throw err;
        res.json(result[0]);
        db.close();
      })
    });
  });

  // Insert a list into a database
  app.post('/api/lists', function(req, res) {

    MongoClient.connect(url, function(err, db) {

      if (err) throw err;
      var now = new Date();
      // create an objct using the data from the request's body
      var list = {
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        user: req.body.user,
        todos: []
      }
      // insert into database
      db.collection("lists").insertOne(list, function(err, response) {
        if (err) res.send(err);
        console.log('Insert successful.', list);
        // get all lists after a successful insert as a response
        db.collection("lists").find({
          user : req.body.user
        }).toArray(function(err, result) {
          if (err) throw err;
          // send all the lists back to the frontend
          res.json(result);
          db.close();
        })
      });
    });
  });


  // Delete a list by ID
  app.delete('/api/lists/:listID', function(req, res) {

    MongoClient.connect(url, function(err, db) {

      if (err) throw err;
      // mongodb requieres an object id as parameter
      var id = new ObjectId(req.params.listID);
      // connect to db and delte entry
      db.collection("lists").deleteOne({
        _id: id
      }, function(err, response) {
        if (err) res.send(err);
        console.log('Delete successful.');
        // get all lists after a successful delete as a response
        db.collection("lists").find({
          user : req.query.username
        }).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
          db.close();
        })
      });
    });
  });

  // Update the list
  // Adding, removing and marking a task as "done" counts as updating
  // the whole list
  app.put('/api/lists/:listID', function(req, res) {

    MongoClient.connect(url, function(err, db) {

      if (err) throw err;

      // the old list will be completely overwritten
      var id = new ObjectId(req.params.listID);
      var updatedList = {
        title: req.body.title,
        date: req.body.date,
        description: req.body.description,
        user: req.body.user,
        todos: req.body.todos
      }

      db.collection("lists").updateOne({
        _id: id
      }, updatedList, function(err, response) {
        if (err) res.send(err);
        console.log('Update successful.');
        // get all lists after a successful update as a response
        db.collection("lists").find({
            _id: id
          })
          .toArray(function(err, result) {
            if (err) res.send(err);
            res.json(result[0]);
            db.close();
          })
      });
    });
  });


  // Save user's credentials in case of authorization service being unreachable
  // This route is part of the offline mode functionality
  app.post('/api/users', function(req, res) {

    MongoClient.connect(url, function(err, db) {

      if (err) throw err;

      // get a random username and password
      var user = {
        username: 'u' + Math.random().toString().substr(2, 8),
        password: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12)
      }

      db.collection("users").insertOne(user, function(err, response) {
        if (err) res.send(err);
        console.log('Insert successful.', user);
        // get all lists after a successful insert as a response
        db.collection("users").find({
            username: user.username
          })
          .toArray(function(err, result) {
            if (err) res.send(err);
            res.json(result);
            db.close();
          })
      });
    });
  });


  app.post('/api/login', function(req, res) {

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
        // get all lists after a successful insert as a response
      console.log(req.body)
      db.collection("users").find({
        username: req.body.username,
        //password: req.body.password
      })
      .toArray(function(err, result) {
        if (err) res.send(err);
        if (result.length == 0) res.sendStatus(204);
        else res.sendStatus(200);

        //res.json(result)
        db.close();
      })
    });
  });

  app.get('*', function(req, res) {
    // load the single view file
    // angular will handle the page (state) changes on the frontend
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });
  });


}
