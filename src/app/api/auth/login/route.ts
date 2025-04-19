import { NextRequest } from 'next/server';
import { findOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log("Login request received");
    const body = await request.json();
    console.log("Login request body:", { email: body.email, password: "***" });
    
    // Validate required fields
    if (!body.email || !body.password) {
      console.log("Missing required fields");
      return errorResponse('Email and password are required');
    }
    
    // Find user by email
    console.log("Finding user by email:", body.email);
    const user = await findOne(User, { email: body.email.toLowerCase() });
    
    if (!user) {
      console.log("User not found");
      return errorResponse('Invalid email or password');
    }
    
    // Verify password
    console.log("Verifying password");
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    
    if (!isPasswordValid) {
      console.log("Invalid password");
      return errorResponse('Invalid email or password');
    }
    
    // Generate JWT token
    console.log("Generating token");
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user.toObject();
    
    console.log("Login successful for user:", user.email);
    return successResponse({
      user: userWithoutPassword,
      token,
    }, 'Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    return serverErrorResponse('Failed to authenticate user');
  }
} 