import dotenv from 'dotenv';

dotenv.config();

export const secretKey = process.env.JWT_SECRET as string;
export const port = process.env.PORT;
export const mongoURI = process.env.MONGODB_URI as string;
export const saltRounds = parseInt(process.env.SALT_ROUNDS as string)