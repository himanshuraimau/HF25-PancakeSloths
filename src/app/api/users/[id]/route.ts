import { NextRequest } from 'next/server';
import { findOne, updateOne, deleteOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import bcrypt from 'bcryptjs';

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
    console.error('Error fetching user:', error);
    return serverErrorResponse('Failed to fetch user');
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
    
    // Prevent updating sensitive fields directly
    const { password, role, isEmailVerified, ...updateData } = body;
    
    // If password is being updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const updatedUser = await updateOne(User, { _id: params.id }, updateData);
    
    // Remove sensitive information before sending response
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    
    return successResponse(userWithoutPassword, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return serverErrorResponse('Failed to update user');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingUser = await findOne(User, { _id: params.id });
    if (!existingUser) {
      return notFoundResponse('User');
    }
    
    // Delete user
    await deleteOne(User, { _id: params.id });
    
    return successResponse(null, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return serverErrorResponse('Failed to delete user');
  }
} 