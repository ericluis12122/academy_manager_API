import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers } from "../controllers/user.controller.js";
import { authorize, isAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();
// Path /users
userRouter.get('/', authorize, isAdmin, getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', authorize, isAdmin, createUser);
userRouter.delete('/:id', authorize, isAdmin, deleteUser);

export default userRouter;