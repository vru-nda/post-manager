import express from 'express';
import {createTag, getTags} from '../controllers/tagController.js';

const router = express.Router();

router.route('/').get(getTags).post(createTag);

export default router;
