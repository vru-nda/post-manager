import dotenv from 'dotenv';
import express from 'express';

import connectDb from './config/db.js';
import {internalError, notFound} from './middleware/errorMiddleware.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

dotenv.config();
connectDb();

const app = express();
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);

app.use(notFound);
app.use(internalError);

const port = process.env.PORT || 3000;
app.listen(
  port,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`
  )
);
