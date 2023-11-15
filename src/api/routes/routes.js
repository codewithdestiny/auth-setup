import { config } from 'dotenv';
import authRoutes from './authRoutes.js';
import errorMiddleware from '../middlewares/errorMiddleware.js';
import httpStatusCodes from '../../config/httpStatusCodes.js';
config();

export default (app) => {

    app.use(`${process.env.API_BASE_URL}/auth`, authRoutes);

    app.use(errorMiddleware);

    app.use("/*", (req, res, next) => {
        return res.status(httpStatusCodes.NOT_FOUND).json({error: true, description: "No Resource Found!"})
    })

}