export interface CreatePostDTO {
    author: string;
    content?: string;
    image?: string;
    createdAt: Date;
}
export interface UpdatePostDTO {
    content?: string;
    image?: string;
    likes?: string[];
    comments?: string[];
}