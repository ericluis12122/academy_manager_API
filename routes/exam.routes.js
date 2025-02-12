import { Router } from "express";

const examRouter = Router();

examRouter.get('/', (req, res) => res.send({ title: 'GET all exams' }));
examRouter.get('/:id', (req, res) => res.send({ title: 'GET exam details' }));
examRouter.post('/', (req, res) => res.send({ title: 'CREATE new exam' }));
examRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE exam' }));
examRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE exam' }));

export default examRouter;
