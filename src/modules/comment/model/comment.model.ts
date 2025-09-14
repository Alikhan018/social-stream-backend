import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
commentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default Comment;