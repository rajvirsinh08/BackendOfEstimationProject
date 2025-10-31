"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.signinUser = exports.signupUser = void 0;
const userModel_1 = __importDefault(require("../Models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';
// Signup user
const signupUser = async (req, res) => {
    const { fullName, email, contactNumber, password } = req.body;
    try {
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        // Always set role as 'developer'
        const user = new userModel_1.default({
            fullName,
            email,
            contactNumber,
            password, // plain text
            role: 'developer'
        });
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            user: { fullName, email, contactNumber, role: 'developer' }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.signupUser = signupUser;
// Signin user
const signinUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await userModel_1.default.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            message: 'Signin successful',
            token,
            user: { fullName: user.fullName, email: user.email, contactNumber: user.contactNumber, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.signinUser = signinUser;
// 🟢 Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find().select('-password'); // exclude password
        res.status(200).json({
            message: 'Users fetched successfully',
            users,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch users',
            error,
        });
    }
};
exports.getAllUsers = getAllUsers;
