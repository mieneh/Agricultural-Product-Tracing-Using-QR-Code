require("dotenv").config();

const express = require('express');

const connectToDatabase = require('./connect/Database');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

connectToDatabase();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});