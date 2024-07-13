import express from "express";
import dotEnv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// configuaration
dotEnv.config();

//database config
connectDB();

//rest object
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
//rest api
app.get("/", (req, res) => {
  res.send({
    message: "welcome to ecommerce app",
  });
});

//port
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server run on port ${PORT} `.bgCyan.white);
});
