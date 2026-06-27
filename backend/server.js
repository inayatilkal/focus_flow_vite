const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./config/db");

console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://focus-flow-vite.vercel.app/",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
