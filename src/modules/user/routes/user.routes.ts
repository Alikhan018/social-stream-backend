import express, { Router } from 'express';
import UserController from '../controller/user.controller';

class UserRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/:userId', UserController.getUserById);
        this.router.put('/:userId', UserController.updateUserProfile);
        this.router.delete('/:userId', UserController.deleteUser);
        this.router.get('/username/:username', UserController.getUserByUsername);
        this.router.get('/email/:email', UserController.getUserByEmail);
        this.router.get('/search/users', UserController.searchUsers);
        this.router.get('/:userId/followers', UserController.getFollowers);
        this.router.get('/:userId/following', UserController.getFollowing);
        this.router.post('/:userId/follow', UserController.followUser);
        this.router.post('/:userId/unfollow', UserController.unfollowUser);
        this.router.get('/:userId/mutual/:otherUserId', UserController.getMutualFollowers);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default UserRoutes;