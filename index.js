import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const PORT = process.env.PORT || process.env.MAIN_URI || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
let client;

if (uri) {
  client = new MongoClient(uri);
}

export async function connectToMongoDB() {
  if (!client) {
    console.warn("MongoDB URI is not provided in environment variables!");
    return null;
  }
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Vercel serverless environment handles requests via export default app
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
