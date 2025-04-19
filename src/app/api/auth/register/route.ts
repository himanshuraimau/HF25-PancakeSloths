import { NextRequest } from 'next/server';
import { findOne, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log("Registration request received");
    const body = await request.json();
    console.log("Registration request body:", { 
      name: body.name, 
      email: body.email, 
      password: "***" 
    });
    
    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      console.log("Missing required fields");
      return errorResponse('Email, password, and name are required');
    }
    
    // Check if user with the same email already exists
    console.log("Checking if user exists:", body.email);
    const existingUser = await findOne(User, { email: body.email });
    if (existingUser) {
      console.log("User already exists");
      return errorResponse('User with this email already exists');
    }
    
    // Hash the password
    console.log("Hashing password");
    const hashedPassword = await hashPassword(body.password);
    
    // Set default values for new users
    const userData = {
      email: body.email,
      password: hashedPassword,
      fullName: body.name, // Map 'name' to 'fullName'
      role: 'user', // Default role for new registrations
      isEmailVerified: false, // Email verification would typically be handled separately
      kycStatus: 'not_started', // Use the correct enum value
    };
    
    console.log("Creating user with data:", { 
      email: userData.email, 
      fullName: userData.fullName, 
      role: userData.role,
      kycStatus: userData.kycStatus
    });
    
    // Create the user
    const user = await createOne(User, userData);
    
    // Generate a token for the new user
    console.log("Generating token for new user");
    const token = generateToken(user._id.toString(), user.role);
    
    // Remove sensitive information from the user object
    const { password, ...userWithoutPassword } = user.toObject();
    
    console.log("Registration successful for user:", user.email);
    return successResponse({
      user: userWithoutPassword,
      token,
    }, 'Registration successful');
  } catch (error) {
    console.error('Error during registration:', error);
    return serverErrorResponse('Failed to register user');
  }
} 