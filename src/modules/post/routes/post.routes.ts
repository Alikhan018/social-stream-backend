import express, { Router } from "express";
import PostController from "../controller/post.controller";

class PostRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', PostController.createPost);
        this.router.get('/:author', PostController.getAllPosts);
        this.router.get('/post/:postId', PostController.getPostById);
        this.router.put('/post/:postId', PostController.updatePost);
        this.router.delete('/post/:postId', PostController.deletePost);
    }


    public getRouter(): Router {
        return this.router;
    }
}

export default PostRoutes;