import { Request, Response } from 'express';
import User from '../Models/userModel';
import jwt from 'jsonwebtoken';

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

// Signup user
export const signupUser = async (req: Request, res: Response) => {
  const { fullName, email, contactNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      return res.status(400).json({ message: 'User already exists' });

    // Always set role as 'developer'
    const user = new User({ 
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Signin user
export const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Signin successful',
      token,
      user: { fullName: user.fullName, email: user.email, contactNumber: user.contactNumber, role: user.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// 🟢 Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error,  
    });
  }
};