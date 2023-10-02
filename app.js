import dotenv from 'dotenv';
import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';

import connectDb from './config/db.js';
import {internalError, notFound} from './middleware/errorMiddleware.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

dotenv.config();
connectDb();

const app = express();
app.use(express.json());

// Configurations for AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-north-1',
});

// filter image file types
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only jpeg, jpg, png, and svg files are allowed.'
      ),
      false
    );
  }
};

// Configure multer with the imageFileFilter
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
});

app.use(upload.single('image'));

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
