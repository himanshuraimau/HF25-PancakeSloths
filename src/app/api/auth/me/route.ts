import { NextRequest } from 'next/server';
import { findOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers (set by the middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return errorResponse('User ID not found in request', 401);
    }
    
    // Find the user by ID
    const user = await findOne(User, { _id: userId });
    
    if (!user) {
      return notFoundResponse('User not found');
    }
    
    // Remove sensitive information from the user object
    const { password, ...userWithoutPassword } = user.toObject();
    
    return successResponse(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return serverErrorResponse('Failed to fetch user profile');
  }
} 