import User from "../../user/model/user.model";
import bcrypt from "bcrypt";
import { saltRounds } from "../../../environment/environment";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import BaseController from "../../../core/controller/base.controller";

class AuthController extends BaseController {
    public static login = async (req: Request, res: Response) => {
        this.handleRequest(
            async () => {
                const { username, password } = req.body;
                if (!username || !password) {
                    throw "Username and password are required";
                }
                const user = await User.findOne({ username });
                if (!user) {
                    throw "Invalid username or password";
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw "Invalid username or password";
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                res.status(200).json({ message: "Login successful", token });
            },
            "User logged in successfully",
            "Error logging in user",
            res
        );
    }
    public static register = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        this.handleRequest(
            async () => {
                if (!username || !email || !password) {
                    throw "Username, email and password are required";
                }
                const existingUser = await User.findOne({ $or: [{ username }, { email }] });
                if (existingUser) {
                    throw "Username or email already exists";
                }
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                req.body.password = hashedPassword;
                const newUser = new User(req.body);
                await newUser.save();
                res.status(201).json({ message: "User registered successfully" });
            },
            "User registered successfully",
            "Error registering user",
            res
        );
    }

}

export default AuthController;