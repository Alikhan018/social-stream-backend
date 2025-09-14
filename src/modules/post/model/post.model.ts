import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema);
postSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default Post;