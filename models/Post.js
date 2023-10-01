import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
