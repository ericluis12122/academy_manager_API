import { Router } from "express";

const resultRouter = Router();

resultRouter.get('/', (req, res) => res.send({ title: 'GET all results' }));
resultRouter.get('/:id', (req, res) => res.send({ title: 'GET result details' }));
resultRouter.post('/', (req, res) => res.send({ title: 'CREATE new result' }));
resultRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE result' }));
resultRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE result' }));

export default resultRouter;
