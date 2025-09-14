import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import UserRoutes from '../modules/user/routes/user.routes';
import User from '../modules/user/model/user.model';
import { UserResponseDTO, FollowerResponseDTO, SearchUserResponseDTO } from '../modules/user/dto/user.dto';

describe('User Module Integration Tests', () => {
    let app: express.Application;
    let mongoServer: MongoMemoryServer;
    let testUsers: any[] = [];

    beforeAll(async () => {
        // Setup in-memory MongoDB
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // Setup Express app
        app = express();
        app.use(express.json());

        const userRoutes = new UserRoutes();
        app.use('/api/users', userRoutes.getRouter());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Clear database and create test users
        await User.deleteMany({});

        // Create test users
        testUsers = await User.create([
            {
                username: 'johndoe',
                email: 'john@example.com',
                password: 'hashedpassword123',
                bio: 'Software Developer',
                profilePicture: 'john-avatar.jpg',
                followers: [],
                following: []
            },
            {
                username: 'janedoe',
                email: 'jane@example.com',
                password: 'hashedpassword456',
                bio: 'Designer',
                profilePicture: 'jane-avatar.jpg',
                followers: [],
                following: []
            },
            {
                username: 'alykhan',
                email: 'aly@example.com',
                password: 'hashedpassword789',
                bio: 'Product Manager',
                profilePicture: 'aly-avatar.jpg',
                followers: [],
                following: []
            },
            {
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedpassword000',
                bio: '',
                profilePicture: '',
                followers: [],
                following: []
            }
        ]);
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('GET /api/users/:userId', () => {
        it('should get user by ID successfully', async () => {
            const response = await request(app)
                .get(`/api/users/${testUsers[0]._id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe('johndoe');
            expect(response.body.email).toBe('john@example.com');
            expect(response.body).not.toHaveProperty('password');
            expect(response.body).toHaveProperty('followersCount', 0);
            expect(response.body).toHaveProperty('followingCount', 0);
        });

        it('should return 404 for non-existent user ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .get(`/api/users/${fakeId}`)
                .expect(404);
        });

        it('should return 500 for invalid user ID format', async () => {
            await request(app)
                .get('/api/users/invalid-id')
                .expect(500);
        });
    });

    describe('PUT /api/users/:userId', () => {
        it('should update user profile successfully', async () => {
            const updateData = {
                username: 'johnupdated',
                bio: 'Updated bio',
                profilePicture: 'new-avatar.jpg'
            };

            const response = await request(app)
                .put(`/api/users/${testUsers[0]._id}`)
                .send(updateData)
                .expect(200);

            expect(response.body.username).toBe('johnupdated');
            expect(response.body.bio).toBe('Updated bio');
            expect(response.body.profilePicture).toBe('new-avatar.jpg');
            expect(response.body.email).toBe('john@example.com'); // Should remain unchanged
        });

        it('should update partial user data', async () => {
            const updateData = { bio: 'New bio only' };

            const response = await request(app)
                .put(`/api/users/${testUsers[0]._id}`)
                .send(updateData)
                .expect(200);

            expect(response.body.bio).toBe('New bio only');
            expect(response.body.username).toBe('johndoe'); // Should remain unchanged
        });

        it('should return 500 for non-existent user update', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .put(`/api/users/${fakeId}`)
                .send({ bio: 'test' })
                .expect(500);
        });
    });

    describe('DELETE /api/users/:userId', () => {
        it('should delete user successfully', async () => {
            const response = await request(app)
                .delete(`/api/users/${testUsers[0]._id}`)
                .expect(200);

            expect(response.body.message).toBe('User deleted successfully');

            // Verify user is deleted
            const deletedUser = await User.findById(testUsers[0]._id);
            expect(deletedUser).toBeNull();
        });

        it('should return 500 for non-existent user deletion', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .delete(`/api/users/${fakeId}`)
                .expect(500);
        });
    });

    describe('GET /api/users/username/:username', () => {
        it('should get user by username successfully', async () => {
            const response = await request(app)
                .get('/api/users/username/johndoe')
                .expect(200);

            expect(response.body.username).toBe('johndoe');
            expect(response.body.email).toBe('john@example.com');
            expect(response.body).not.toHaveProperty('password');
        });

        it('should return 404 for non-existent username', async () => {
            await request(app)
                .get('/api/users/username/nonexistent')
                .expect(404);
        });
    });

    describe('GET /api/users/email/:email', () => {
        it('should get user by email successfully', async () => {
            const response = await request(app)
                .get('/api/users/email/john@example.com')
                .expect(200);

            expect(response.body.username).toBe('johndoe');
            expect(response.body.email).toBe('john@example.com');
        });

        it('should return 404 for non-existent email', async () => {
            await request(app)
                .get('/api/users/email/nonexistent@example.com')
                .expect(404);
        });
    });

    describe('GET /api/users/search/users', () => {
        it('should search users successfully', async () => {
            const response = await request(app)
                .get('/api/users/search/users?query=john')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].username).toBe('johndoe');
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).not.toHaveProperty('password');
        });

        it('should search users case-insensitively', async () => {
            const response = await request(app)
                .get('/api/users/search/users?query=JOHN')
                .expect(200);

            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0].username).toBe('johndoe');
        });

        it('should search with partial match', async () => {
            const response = await request(app)
                .get('/api/users/search/users?query=aly')
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].username).toBe('alykhan');
        });

        it('should return empty array for no matches', async () => {
            const response = await request(app)
                .get('/api/users/search/users?query=nonexistentuser')
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('should return 400 for empty search query', async () => {
            await request(app)
                .get('/api/users/search/users?query=')
                .expect(400);
        });

        it('should return 400 for missing search query', async () => {
            await request(app)
                .get('/api/users/search/users')
                .expect(400);
        });
    });

    describe('Follow/Unfollow System', () => {
        describe('POST /api/users/:userId/follow', () => {
            it('should follow user successfully', async () => {
                const response = await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() })
                    .expect(200);

                expect(response.body.message).toBe('Successfully followed the user');

                // Verify follow relationship
                const user = await User.findOne(testUsers[0]._id);
                const targetUser = await User.findOne(testUsers[1]._id);

                expect(user?.following).toContainEqual(testUsers[1]._id);
                expect(targetUser?.followers).toContainEqual(testUsers[0]._id);
            });

            it('should return 400 when trying to follow yourself', async () => {
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[0]._id.toString() })
                    .expect(400);
            });

            it('should return 400 for missing targetUserId', async () => {
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({})
                    .expect(400);
            });

            it('should return 500 when already following user', async () => {
                // First follow
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() })
                    .expect(200);

                // Try to follow again
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() })
                    .expect(500);
            });
        });

        describe('POST /api/users/:userId/unfollow', () => {
            beforeEach(async () => {
                // Setup follow relationship
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() });
            });

            it('should unfollow user successfully', async () => {
                const response = await request(app)
                    .post(`/api/users/${testUsers[0]._id}/unfollow`)
                    .send({ targetUserId: testUsers[1]._id.toString() })
                    .expect(200);

                expect(response.body.message).toBe('Successfully unfollowed the user');

                // Verify unfollow relationship
                const user = await User.findById(testUsers[0]._id);
                const targetUser = await User.findById(testUsers[1]._id);

                expect(user?.following).not.toContain(testUsers[1]._id);
                expect(targetUser?.followers).not.toContain(testUsers[0]._id);
            });

            it('should return 400 when trying to unfollow yourself', async () => {
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/unfollow`)
                    .send({ targetUserId: testUsers[0]._id.toString() })
                    .expect(400);
            });

            it('should return 500 when not following user', async () => {
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/unfollow`)
                    .send({ targetUserId: testUsers[2]._id.toString() })
                    .expect(500);
            });
        });

        describe('GET /api/users/:userId/followers', () => {
            beforeEach(async () => {
                // Setup followers: testUsers[1] and testUsers[2] follow testUsers[0]
                await request(app)
                    .post(`/api/users/${testUsers[1]._id}/follow`)
                    .send({ targetUserId: testUsers[0]._id.toString() });

                await request(app)
                    .post(`/api/users/${testUsers[2]._id}/follow`)
                    .send({ targetUserId: testUsers[0]._id.toString() });
            });

            it('should get followers list successfully', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[0]._id}/followers`)
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(2);
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: 'janedoe' }),
                        expect.objectContaining({ username: 'alykhan' })
                    ])
                );
            });

            it('should return empty array for user with no followers', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[3]._id}/followers`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });
        });

        describe('GET /api/users/:userId/following', () => {
            beforeEach(async () => {
                // Setup following: testUsers[0] follows testUsers[1] and testUsers[2]
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() });

                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[2]._id.toString() });
            });

            it('should get following list successfully', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[0]._id}/following`)
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(2);
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: 'janedoe' }),
                        expect.objectContaining({ username: 'alykhan' })
                    ])
                );
            });

            it('should return empty array for user following nobody', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[3]._id}/following`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });
        });

        describe('GET /api/users/:userId/mutual/:otherUserId', () => {
            beforeEach(async () => {
                // Setup complex follow relationships for mutual followers test
                // testUsers[0] follows testUsers[2] and testUsers[3]
                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[2]._id.toString() });

                await request(app)
                    .post(`/api/users/${testUsers[0]._id}/follow`)
                    .send({ targetUserId: testUsers[3]._id.toString() });

                // testUsers[1] has testUsers[2] and testUsers[3] as followers
                await request(app)
                    .post(`/api/users/${testUsers[2]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() });

                await request(app)
                    .post(`/api/users/${testUsers[3]._id}/follow`)
                    .send({ targetUserId: testUsers[1]._id.toString() });
            });

            it('should get mutual followers successfully', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[0]._id}/mutual/${testUsers[1]._id}`)
                    .expect(200);

                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(2);
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ username: 'alykhan' }),
                        expect.objectContaining({ username: 'testuser' })
                    ])
                );
            });

            it('should return empty array when no mutual followers', async () => {
                const response = await request(app)
                    .get(`/api/users/${testUsers[0]._id}/mutual/${testUsers[3]._id}`)
                    .expect(200);

                expect(response.body).toEqual([]);
            });

            it('should return 500 for non-existent user in mutual check', async () => {
                const fakeId = new mongoose.Types.ObjectId();
                await request(app)
                    .get(`/api/users/${testUsers[0]._id}/mutual/${fakeId}`)
                    .expect(500);
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle database connection errors gracefully', async () => {
            // Temporarily close database connection
            await mongoose.disconnect();

            await request(app)
                .get(`/api/users/${testUsers[0]._id}`)
                .expect(500);

            // Reconnect for other tests
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
        });

        it('should handle invalid ObjectId formats', async () => {
            await request(app)
                .get('/api/users/invalid-object-id')
                .expect(500);
        });

        it('should handle missing request body for updates', async () => {
            const response = await request(app)
                .put(`/api/users/${testUsers[0]._id}`)
                .send({})
                .expect(200);

            // Should return user unchanged
            expect(response.body.username).toBe('johndoe');
        });
    });

    describe('Data Integrity', () => {
        it('should not expose password in any response', async () => {
            // Test various endpoints
            const endpoints = [
                `/api/users/${testUsers[0]._id}`,
                `/api/users/username/johndoe`,
                `/api/users/email/john@example.com`,
                '/api/users/search?query=john'
            ];

            for (const endpoint of endpoints) {
                const response = await request(app).get(endpoint);

                if (response.status === 200) {
                    if (Array.isArray(response.body)) {
                        response.body.forEach(user => {
                            expect(user).not.toHaveProperty('password');
                        });
                    } else {
                        expect(response.body).not.toHaveProperty('password');
                    }
                }
            }
        });

        it('should maintain follower count consistency', async () => {
            // Follow user
            await request(app)
                .post(`/api/users/${testUsers[0]._id}/follow`)
                .send({ targetUserId: testUsers[1]._id.toString() });

            // Check follower counts
            const follower = await request(app)
                .get(`/api/users/${testUsers[0]._id}`)
                .expect(200);

            const followed = await request(app)
                .get(`/api/users/${testUsers[1]._id}`)
                .expect(200);

            expect(follower.body.followingCount).toBe(1);
            expect(followed.body.followersCount).toBe(1);

            // Unfollow user
            await request(app)
                .post(`/api/users/${testUsers[0]._id}/unfollow`)
                .send({ targetUserId: testUsers[1]._id.toString() });

            // Check counts again
            const followerAfter = await request(app)
                .get(`/api/users/${testUsers[0]._id}`)
                .expect(200);

            const followedAfter = await request(app)
                .get(`/api/users/${testUsers[1]._id}`)
                .expect(200);

            expect(followerAfter.body.followingCount).toBe(0);
            expect(followedAfter.body.followersCount).toBe(0);
        });
    });
});