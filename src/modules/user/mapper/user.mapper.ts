import { UserResponseDTO, FollowerResponseDTO, SearchUserResponseDTO } from "../dto/user.dto";

export class UserMapper {
    public static toUserResponse(user: any): UserResponseDTO {
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    public static toFollowerResponse(user: any): FollowerResponseDTO {
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        };
    }

    public static toSearchResponse(user: any): SearchUserResponseDTO {
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        };
    }
}
