import { Types } from "mongoose";
import { CreatePostDTO, UpdatePostDTO } from "../dto/post.dto";
import Post from "../model/post.model";

class PostService {
    public createPost = async (data: CreatePostDTO) => {
        const post = new Post(data);
        return await post.save();
    }
    public getAllPosts = async (author: string) => {
        const authorObjectId = new Types.ObjectId(author);
        return await Post.find({ author: authorObjectId }).populate('author', 'username email');
    }
    public getPostById = async (postId: string) => {
        const postObjectId = new Types.ObjectId(postId);
        return await Post.findById({ _id: postObjectId }).populate('author', 'username email');
    }
    public updatePost = async (postId: string, data: UpdatePostDTO) => {
        const postObjectId = new Types.ObjectId(postId);
        const post = await Post.findOne({ _id: postObjectId });
        if (!post) throw new Error('Post not found');
        post.set(data);
        return await post.save();
    }
    public deletePost = async (postId: string) => {
        const postObjectId = new Types.ObjectId(postId);
        return await Post.findByIdAndDelete({ _id: postObjectId });
    }
}

export default new PostService();