import { NextRequest } from 'next/server';
import { findOne, updateOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await findOne(User, { _id: params.id }, { select: { password: 0 as 0 } });
    
    if (!user) {
      return notFoundResponse('User');
    }
    
    return successResponse(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return serverErrorResponse('Failed to fetch user profile');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingUser = await findOne(User, { _id: params.id });
    if (!existingUser) {
      return notFoundResponse('User');
    }
    
    const body = await request.json();
    
    // Only allow updating profile-related fields
    const allowedUpdates = [
      'fullName',
      'username',
      'avatar',
      'preferences',
      'wallets',
    ];
    
    const updates: any = {};
    
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }
    
    // Update user
    const updatedUser = await updateOne(User, { _id: params.id }, updates);
    
    // Remove sensitive information before sending response
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    
    return successResponse(userWithoutPassword, 'User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    return serverErrorResponse('Failed to update user profile');
  }
} 