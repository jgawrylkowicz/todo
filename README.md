# Todo

## Service deployment

The service is deployed through the Express framework and is reachable for other teammates under 10.102.107.5:8080. 
Even though the site will route to the home page with all the lists
automatically, it should still be accessed from 10.102.107.5:8080/login first. 
Otherwise, no user session will be created, which is necessary to be able to access any data from the server.

## Installation


The service can now be started with a single script, which configures the database and starts server automatically. 
First we need to download all the required node modules and save them locally.
```bash
$ npm install
```

Then we have to create a database for the local entries. First we need to make sure that MongoDB service is up and running. To start the service (read the documentation on how to start the service on your system https://docs.mongodb.com/manual/administration/install-community/)  
```bash
$ services start mongod (Debian)
```
```bash
$ systemctl start mongodb.service (Arch)
```
After everything has been installed correctly, it is now possible to start the server via:
```bash
$ npm start
```
The site can be accessed locally at: localhost:8080

Additionally it is possible to start the server via:
```bash
$ node server.js 
```
or
```bash
$ nodemon server.js
```

## Screenshots

![alt text](https://github.com/jgawrylkowicz/todo/blob/master/img/supd-3.png "lists")
![alt text](https://github.com/jgawrylkowicz/todo/blob/master/img/supd-2.png "login")
