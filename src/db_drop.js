conn = new Mongo();
db = conn.getDB("todosdb");
db.dropDatabase();
