#!/bin/bash
exec mongo localhost:27017/todosdb db_create.js &
exec nodemon server.js
