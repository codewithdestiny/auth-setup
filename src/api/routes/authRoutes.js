import { Router } from "express";
import registerUser from "../controllers/registerUser.js";
import loginUser from "../controllers/loginUser.js";
import requestPasswordReset from '../controllers/requestPasswordReset.js'
import resetPassword from "../controllers/resetPassword.js";
import verifyJwt from '../middlewares/verifyJwt.js';
import changePassword from '../controllers/changePassword.js';
import profileUpdate from "../controllers/profileUpdate.js";
import deleteAccount from "../controllers/deleteAccount.js";
import getMe from "../controllers/getMe.js";
const authRoutes = Router();

authRoutes.post('/register-user', registerUser);

authRoutes.post('/login', loginUser);

authRoutes.post('/password/reset/request', requestPasswordReset)

authRoutes.post('/password/reset/change', resetPassword);

authRoutes.post('/password/change', verifyJwt, changePassword);

authRoutes.put('/profile-update', verifyJwt, profileUpdate);

authRoutes.post('/delete-account', verifyJwt, deleteAccount);

authRoutes.get('/getme', verifyJwt, getMe);

export default authRoutes;