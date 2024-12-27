require("dotenv").config();

const express = require('express');

const connectToDatabase = require('./connect/Database');
const authRouter = require('./routers/AuthRouter');
const userRouter = require('./routers/UserRouter');

const categoryRouter = require('./routers/CategoryRouter');
const productRouter = require('./routers/ProductRouter');
const processRouter = require('./routers/ProcessRouter')
const regionRouter = require('./routers/RegionRouter')
const harvestRouter = require('./routers/HarvestRouter')
const vehicleRouter = require('./routers/VehicleRouter');
const driverRouter = require('./routers/DriverRouter');
const routeRouter = require('./routers/RouteRouter');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

connectToDatabase();
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/processes', processRouter);
app.use('/api/regions', regionRouter);
app.use('/api/harvests', harvestRouter);

app.use('/api/vehicles', vehicleRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/routes', routeRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});