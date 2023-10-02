import asyncHandler from 'express-async-handler';
import AWS from 'aws-sdk';

import Post from '../models/Post.js';
import Tag from '../models/Tag.js';

import {paginate} from '../utils/utilities.js';

const s3 = new AWS.S3();

// @desc    Fetch all Posts with Sorting, Pagination, Keyword Search, and Tag Filtering
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 5,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    keyword,
    tagName,
  } = req.query;

  const query = Post.find();

  // Apply keyword search if provided
  if (keyword) {
    query.or([
      {title: {$regex: keyword, $options: 'i'}},
      {description: {$regex: keyword, $options: 'i'}},
    ]);
  }

  // Apply tag filtering if provided
  if (tagName) {
    const tag = await Tag.findOne({name: tagName});

    if (tag) {
      query.where('tags').in([tag._id]);
    }
  }

  // Sorting and pagination
  query.sort({[sortBy]: sortOrder});
  const paginatedResults = await paginate(Post, query, page, limit);
  res.json(paginatedResults);
});

// @desc    Search for posts containing a keyword in title or description with Pagination
// @route   GET /api/posts/search?keyword
// @access  Public
const searchKeyword = asyncHandler(async (req, res) => {
  const {page = 1, limit = 5, keyword} = req.query;

  if (!keyword) {
    throw new Error('Keyword parameter is required.');
  }

  const query = Post.find({
    $or: [
      {title: {$regex: keyword, $options: 'i'}},
      {description: {$regex: keyword, $options: 'i'}},
    ],
  });

  const paginatedResults = await paginate(Post, query, page, limit);
  res.json(paginatedResults);
});

// @desc    Filter posts by a specific tag name with Pagination
// @route   GET /api/posts/filter?tagName
// @access  Public
const filterByKeyword = asyncHandler(async (req, res) => {
  const {page = 1, limit = 5, tagName} = req.query;

  if (!tagName) {
    throw new Error('TagName parameter is required.');
  }

  const tag = await Tag.findOne({name: tagName});

  if (!tag) {
    throw new Error('Invalid Tag Name.');
  }

  const query = Post.find({tags: tag._id});
  const paginatedResults = await paginate(Post, query, page, limit);
  res.json(paginatedResults);
});

// @desc    Create a new Post
// @route   POST /api/posts
// @access  Public
const createPost = asyncHandler(async (req, res) => {
  const {title, description, tags} = req.body;
  let imageUrl = null;

  // Check for image
  if (req.file) {
    const imageFile = req.file;
    const imageName = `${Date.now()}.${imageFile.originalname
      .split('.')
      .pop()}`;

    // Configuration parameters for the S3 upload
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: imageFile.buffer,
      ACL: 'public-read',
    };

    // Upload the image to S3 bucket
    const uploadResult = await s3.upload(params).promise();
    if (!uploadResult) {
      res.status(400);
      throw new Error('Error uploading the image');
    }
    imageUrl = uploadResult.Location;
  }

  const post = await Post.create({title, description, image: imageUrl, tags});

  if (post) {
    res.status(201).json({message: 'Post created successfully', post});
  } else {
    res.status(400);
    throw new Error('Error creating new post');
  }
});

export {createPost, filterByKeyword, getPosts, searchKeyword};
