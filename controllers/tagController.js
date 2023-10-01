import Tag from '../models/Tag.js';
import asyncHandler from 'express-async-handler';

// @desc    Fetch all Tags
// @route   GET /api/tags
// @acesss  Public
const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({});
  res.json(tags);
});

// @desc    Create a new tag
// @route   POST /api/tags
// @acesss  Public
const createTag = asyncHandler(async (req, res) => {
  const tag = await Tag.create({name: req.body.name});

  if (tag) {
    res.status(201).json({message: 'Tag created successfully', tag});
  } else {
    res.status(400);
    throw new Error('Error creating new tag');
  }
});

export {getTags, createTag};
