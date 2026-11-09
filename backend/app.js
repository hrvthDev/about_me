
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("../backend/router/authRouter.js");

const app = express();

app.use(express.json());


app.use(cors());

app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API fut: http://localhost:${PORT}`);
});
