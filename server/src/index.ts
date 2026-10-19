import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { ErrorMiddleware } from './middlewares/error.middleware.js';

// client
import authRouter from './routes/client/auth.routes.js';
import commentRouter from './routes/client/comment.routes.js';
import postRouter from './routes/client/post.routes.js';

// server
import categoryRouter from './routes/server/category.routes.js';
import tagRouter from './routes/server/tag.routes.js';
import userRouter from './routes/server/user.routes.js';

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// cors
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_MOBILE_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);

app.use('/api/categories', categoryRouter);
app.use('/api/tags', tagRouter);
app.use('/api/users', userRouter);

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}:${HOST}`);
});
