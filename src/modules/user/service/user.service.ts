import { Types } from "mongoose";
import User from "../model/user.model";
import { UpdateUserDTO, UserResponseDTO, SearchUserResponseDTO, FollowerResponseDTO } from "../dto/user.dto";
import { UserMapper } from "../mapper/user.mapper";

class UserService {
    public static async getUserById(userId: string): Promise<UserResponseDTO | null> {
        const user = await User.findById(userId).select("-password").exec();
        return user ? UserMapper.toUserResponse(user) : null;
    }

    public static async updateUserProfile(userId: string, updateData: UpdateUserDTO): Promise<UserResponseDTO> {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        if (updateData.username) user.username = updateData.username;
        if (updateData.email) user.email = updateData.email;
        if (updateData.bio !== undefined) user.bio = updateData.bio;
        if (updateData.profilePicture !== undefined) user.profilePicture = updateData.profilePicture;

        await user.save();
        return UserMapper.toUserResponse(user);
    }

    public static async getUserByUsername(username: string): Promise<UserResponseDTO | null> {
        const user = await User.findOne({ username }).select("-password").exec();
        return user ? UserMapper.toUserResponse(user) : null;
    }

    public static async searchUsers(query: string): Promise<SearchUserResponseDTO[]> {
        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }).select("username email profilePicture");
        return users.map(UserMapper.toSearchResponse);
    }

    public static async getUserByEmail(email: string): Promise<UserResponseDTO | null> {
        const user = await User.findOne({ email }).select("-password").exec();
        return user ? UserMapper.toUserResponse(user) : null;
    }

    public static async getFollowers(userId: string): Promise<FollowerResponseDTO[]> {
        const user = await User.findById(userId).populate("followers", "username email profilePicture").exec();
        if (!user) throw new Error("User not found");
        return (user.followers as any[]).map(UserMapper.toFollowerResponse);
    }

    public static async getFollowing(userId: string): Promise<FollowerResponseDTO[]> {
        const user = await User.findById(userId).populate("following", "username email profilePicture").exec();
        if (!user) throw new Error("User not found");
        return (user.following as any[]).map(UserMapper.toFollowerResponse);
    }

    public static async followUser(userId: string, targetUserId: string): Promise<{ message: string }> {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
        const userObjectId = new Types.ObjectId(userId);
        const targetUserObjectId = new Types.ObjectId(targetUserId);

        if (!user || !targetUser) throw new Error("User not found");
        if (user.following.includes(targetUserObjectId)) throw new Error("Already following this user");

        user.following.push(targetUserObjectId);
        targetUser.followers.push(userObjectId);

        await user.save();
        await targetUser.save();

        return { message: "Successfully followed the user" };
    }

    public static async unfollowUser(userId: string, targetUserId: string): Promise<{ message: string }> {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
        const userObjectId = new Types.ObjectId(userId);
        const targetUserObjectId = new Types.ObjectId(targetUserId);

        if (!user || !targetUser) throw new Error("User not found");
        if (!user.following.includes(targetUserObjectId)) throw new Error("You are not following this user");

        user.following = user.following.filter(f => !f.equals(targetUserObjectId));
        targetUser.followers = targetUser.followers.filter(f => !f.equals(userObjectId));

        await user.save();
        await targetUser.save();

        return { message: "Successfully unfollowed the user" };
    }

    public static async getMutualFollowers(userId: string, otherUserId: string): Promise<FollowerResponseDTO[]> {
        const user = await User.findById(userId).select("following");
        const otherUser = await User.findById(otherUserId).select("followers");
        if (!user || !otherUser) throw new Error("User not found");

        const mutuals = user.following.filter(f =>
            otherUser.followers.some(of => of.equals(f))
        );

        const mutualUsers = await User.find({ _id: { $in: mutuals } }).select("username profilePicture email");
        return mutualUsers.map(UserMapper.toFollowerResponse);
    }

    public static async deleteUser(userId: string): Promise<{ message: string }> {
        const deleted = await User.findByIdAndDelete(userId).exec();
        if (!deleted) throw new Error("User not found");
        return { message: "User deleted successfully" };
    }
}

export default UserService;
