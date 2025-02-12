import { Router } from "express";

const rankingRouter = Router();

rankingRouter.get('/', (req, res) => res.send({ title: 'GET daily ranking' }));

export default rankingRouter;
