import { NextRequest } from 'next/server';
import { findOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.token) {
      return errorResponse('Token is required');
    }
    
    // Verify the token
    const decoded = jwt.verify(
      body.token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; email: string; role: string };
    
    // Find the user
    const user = await findOne(User, { _id: decoded.userId });
    
    if (!user) {
      return errorResponse('User not found');
    }
    
    // Generate a new token
    const newToken = jwt.sign(
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
    
    return successResponse({
      user: userWithoutPassword,
      token: newToken,
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing token:', error);
    return errorResponse('Invalid or expired token', 401);
  }
} 