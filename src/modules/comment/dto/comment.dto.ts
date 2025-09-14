export interface CreateCommentDTO {
    post: string;
    author: string;
    text: string;
    createdAt: Date;
}
export interface UpdateCommentDTO {
    text?: string;
    likes?: string[];
    updatedAt: Date;
}