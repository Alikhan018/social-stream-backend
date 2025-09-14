import { Request, Response } from 'express';
import BaseController from '../../../core/controller/base.controller';
import UserService from '../service/user.service';
import { UpdateUserDTO, SearchUserDTO } from '../dto/user.dto';

class UserController extends BaseController {

    public static async getUserById(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                const user = await UserService.getUserById(userId);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                return user;
            },
            `User retrieved successfully for ID: ${req.params.userId}`,
            'Failed to retrieve user by ID',
            res
        );
    }

    public static async updateUserProfile(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                const updateData: UpdateUserDTO = req.body;
                return await UserService.updateUserProfile(userId, updateData);
            },
            `User profile updated successfully for ID: ${req.params.userId}`,
            'Failed to update user profile',
            res
        );
    }

    public static async getUserByUsername(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { username } = req.params;
                const user = await UserService.getUserByUsername(username);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                return user;
            },
            `User retrieved successfully for username: ${req.params.username}`,
            'Failed to retrieve user by username',
            res
        );
    }

    public static async searchUsers(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { query } = req.query as { query: string };
                if (!query || query.trim() === '') {
                    res.status(400).json({ error: 'Search query is required' });
                    return;
                }
                return await UserService.searchUsers(query);
            },
            `Users searched successfully for query: ${req.query.query}`,
            'Failed to search users',
            res
        );
    }

    public static async getUserByEmail(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { email } = req.params;
                const user = await UserService.getUserByEmail(email);
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }
                return user;
            },
            `User retrieved successfully for email: ${req.params.email}`,
            'Failed to retrieve user by email',
            res
        );
    }

    public static async getFollowers(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                return await UserService.getFollowers(userId);
            },
            `Followers retrieved successfully for user ID: ${req.params.userId}`,
            'Failed to retrieve followers',
            res
        );
    }

    public static async getFollowing(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                return await UserService.getFollowing(userId);
            },
            `Following list retrieved successfully for user ID: ${req.params.userId}`,
            'Failed to retrieve following list',
            res
        );
    }

    public static async followUser(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                const { targetUserId } = req.body;

                if (!targetUserId) {
                    res.status(400).json({ error: 'Target user ID is required' });
                    return;
                }

                if (userId === targetUserId) {
                    res.status(400).json({ error: 'Cannot follow yourself' });
                    return;
                }

                return await UserService.followUser(userId, targetUserId);
            },
            `User followed successfully: ${req.params.userId} -> ${req.body.targetUserId}`,
            'Failed to follow user',
            res
        );
    }

    public static async unfollowUser(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                const { targetUserId } = req.body;

                if (!targetUserId) {
                    res.status(400).json({ error: 'Target user ID is required' });
                    return;
                }

                if (userId === targetUserId) {
                    res.status(400).json({ error: 'Cannot unfollow yourself' });
                    return;
                }

                return await UserService.unfollowUser(userId, targetUserId);
            },
            `User unfollowed successfully: ${req.params.userId} -> ${req.body.targetUserId}`,
            'Failed to unfollow user',
            res
        );
    }

    public static async getMutualFollowers(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId, otherUserId } = req.params;
                return await UserService.getMutualFollowers(userId, otherUserId);
            },
            `Mutual followers retrieved successfully between users: ${req.params.userId} and ${req.params.otherUserId}`,
            'Failed to retrieve mutual followers',
            res
        );
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        await BaseController.handleRequest(
            async () => {
                const { userId } = req.params;
                return await UserService.deleteUser(userId);
            },
            `User deleted successfully for ID: ${req.params.userId}`,
            'Failed to delete user',
            res
        );
    }
}

export default UserController;