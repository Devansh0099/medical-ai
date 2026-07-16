require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRouter = require("./routes/userRoute");
const predictionRoutes = require("./routes/prediction");

const checkForAuth = require("./middlewares/auth");

const app = express();

connectDB();

// app.use(cors({
//     origin: true,
//     credentials: true
// }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://medical-ai-rho-three.vercel.app",
  "https://medical-ai-git-main-devansh0099s-projects.vercel.app",
  "https://medical-9a3mby5b6-devansh0099s-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(checkForAuth("token"));

app.use("/user", userRouter);
app.use("/api/predict", predictionRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});