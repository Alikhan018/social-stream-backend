import { Request, Response } from "express";
import BaseController from "../../../core/controller/base.controller";
import PostService from "../service/post.service";
import { CreatePostDTO } from "../dto/post.dto";

class PostController extends BaseController {
    public static createPost = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const postData: CreatePostDTO = req.body;
                return await PostService.createPost(postData)
            },
            "Post created successfully",
            "Failed to create post",
            res
        )
    }
    public static getAllPosts = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const author = req.params.author;
                return await PostService.getAllPosts(author)
            },
            "Posts fetched successfully",
            "Failed to fetch posts",
            res
        )
    }
    public static getPostById = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const postId = req.params.postId;
                return await PostService.getPostById(postId)
            },
            "Post fetched successfully",
            "Failed to fetch post",
            res
        )
    }
    public static updatePost = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const postId = req.params.postId;
                const postData = req.body;
                return await PostService.updatePost(postId, postData)
            },
            "Post updated successfully",
            "Failed to update post",
            res
        )
    }
    public static deletePost = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const postId = req.params.postId;
                return await PostService.deletePost(postId)
            },
            "Post deleted successfully",
            "Failed to delete post",
            res
        )
    }
}

export default PostController;