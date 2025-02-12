import { Router } from "express";

const questionRouter = Router();

questionRouter.get('/', (req, res) => res.send({ title: 'GET all questions' }));
questionRouter.get('/:id', (req, res) => res.send({ title: 'GET question details' }));
questionRouter.post('/', (req, res) => res.send({ title: 'CREATE new question' }));
questionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE question' }));
questionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE question' }));

export default questionRouter;