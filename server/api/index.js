import express from "express";
import databaseService from "../services/database.service.js";
import userRoute from "../routes/user.route.js";
import productRoute from "../routes/product.route.js";
import cors from 'cors';
import refreshRoute from "../routes/refresh.token.route.js";
import mediaRoute from "../routes/media.route.js";
import orderRoute from "../routes/order.route.js";
import customerRoute from "../routes/customer.route.js";
import mediaCustomerRoute from "../routes/media.customer.route.js";
import dashboardRoute from "../routes/dashboard.route.js";

const app = express();
// const PORT = 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cors(corsOptions));

app.use(express.json());

databaseService.connect();

app.use("/", userRoute);
app.use("/", refreshRoute);
app.use("/", mediaRoute);
app.use("/", mediaCustomerRoute);
app.use("/dashboard", productRoute);
app.use("/dashboard", orderRoute);
app.use("/dashboard", customerRoute)
app.use("/dashboard", dashboardRoute)
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });

export default app;
