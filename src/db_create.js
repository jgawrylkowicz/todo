conn = new Mongo();
db = conn.getDB("todosdb");
db.createCollection("lists");
db.createCollection("users");
