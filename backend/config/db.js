const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI Exists:", !!process.env.MONGO_URI);

    const client = new MongoClient(process.env.MONGO_URI);

    await client.connect();

    db = client.db("focusflow");

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
};

module.exports = {
  connectDB,
  getDB,
};
