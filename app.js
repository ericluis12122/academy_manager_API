import express from 'express';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import questionRouter from './routes/question.routes.js';
import examRouter from './routes/exam.routes.js';
import resultRouter from './routes/result.routes.js';
import rankingRouter from './routes/ranking.routes.js';

import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auths', authRouter);
app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/exams', examRouter);
app.use('/results', resultRouter);
app.use('/ranking', rankingRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the Study API');
});

app.listen(PORT, async () => {
    console.log(`Stusy API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;