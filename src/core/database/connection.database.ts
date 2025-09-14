import mongoose from 'mongoose';
import { mongoURI } from '../../environment/environment';

class DatabaseConnection {
    public async connect() {
        try {
            await mongoose.connect(mongoURI);
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }
}

export default new DatabaseConnection();