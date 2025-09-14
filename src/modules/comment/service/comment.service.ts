import { CreateCommentDTO, UpdateCommentDTO } from "../dto/comment.dto";
import Comment from "../model/comment.model";

class CommentService {
    public createComment = async (data: CreateCommentDTO) => {
        const comment = new Comment(data);
        return await comment.save();
    }
    public getCommentsByPost = async (postId: string) => {
        return await Comment.find({ post: postId }).populate('author', 'username profilePicture').exec();
    }
    public updateComment = async (commentId: string, data: UpdateCommentDTO) => {
        const comment = await Comment.findById(commentId).exec();
        if (!comment) {
            throw new Error("Comment not found");
        }
        comment.set(data);
        return await comment.save();
    }
    public deleteComment = async (commentId: string) => {
        return await Comment.findByIdAndDelete(commentId).exec();
    }
}

export default new CommentService();