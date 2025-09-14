
export interface UpdateUserDTO {
    username?: string;
    email?: string;
    bio?: string;
    profilePicture?: string;
}

export interface SearchUserDTO {
    query: string;
}

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    followersCount: number;
    followingCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface FollowerResponseDTO {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
}

export interface FollowingResponseDTO extends FollowerResponseDTO { }

export interface SearchUserResponseDTO {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
}
