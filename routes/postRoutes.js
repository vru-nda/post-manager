import express from 'express';
import {
  createPost,
  filterByKeyword,
  getPosts,
  searchKeyword,
} from '../controllers/postController.js';

const router = express.Router();

router.route('/filter').get(filterByKeyword);
router.route('/search').get(searchKeyword);
router.route('/').get(getPosts).post(createPost);

export default router;
