require("dotenv").config();

const express = require('express');

const connectToDatabase = require('./connect/Database');
const authRouter = require('./routers/AuthRouter');
const userRouter = require('./routers/UserRouter');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

connectToDatabase();
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});