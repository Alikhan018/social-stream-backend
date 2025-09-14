import express, { Router } from "express";
import CommentController from "../controller/comment.controller";

class CommentRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', CommentController.createComment);
        this.router.get('/post/:postId', CommentController.getCommentsByPost);
        this.router.put('/:commentId', CommentController.updateComment);
        this.router.delete('/:commentId', CommentController.deleteComment);
    }


    public getRouter(): Router {
        return this.router;
    }

}

export default CommentRoutes