import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express from 'express';
import routes from './api/routes/routes.js';
import connectDb from './config/dbConfig.js';
import compression from 'compression';
config()

export default (app) => {
    const PORT = process.env.PORT || 5000;

    app.use(cookieParser());

    app.use(helmet());

    app.use(compression());

    app.use(express.json());

    routes(app);

    app.use(express.urlencoded({extended: false}))

    app.use(morgan("dev"))

    app.listen(PORT, () => {

        connectDb();
        
        console.log(`Server is running on port ${PORT}`);
    })
}