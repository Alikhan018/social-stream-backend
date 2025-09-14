import { Request, Response } from "express";
import BaseController from "../../../core/controller/base.controller";
import CommentService from "../service/comment.service";
import { CreateCommentDTO } from "../dto/comment.dto";


class CommentController extends BaseController {
    public static createComment = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const commentData: CreateCommentDTO = req.body;
                return await CommentService.createComment(commentData)
            },
            "Comment created successfully",
            "Failed to create comment",
            res
        )
    }
    public static getCommentsByPost = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const postId = req.params.postId;
                return await CommentService.getCommentsByPost(postId)
            },
            "Comments fetched successfully",
            "Failed to fetch comments",
            res
        )
    }
    public static updateComment = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const commentId = req.params.commentId;
                const commentData = req.body;
                return await CommentService.updateComment(commentId, commentData)
            },
            "Comment updated successfully",
            "Failed to update comment",
            res
        )
    }
    public static deleteComment = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const commentId = req.params.commentId;
                return await CommentService.deleteComment(commentId)
            },
            "Comment deleted successfully",
            "Failed to delete comment",
            res
        )
    }

}

export default CommentController;