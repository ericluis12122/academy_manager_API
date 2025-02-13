import { Router } from "express";
import { SignIn, SignUp, VerifyEmail } from "../controllers/auth.controller.js";

const authRouter = Router();
// Path /auths
authRouter.post('/sign_up', SignUp);
authRouter.post('/sign_in', SignIn);
authRouter.get('/verify_email/:token', VerifyEmail);

export default authRouter;