import { NextRequest } from 'next/server';
import { findMany, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    // Add filters based on query parameters
    if (searchParams.has('role')) {
      filter.role = searchParams.get('role');
    }
    
    if (searchParams.has('kycStatus')) {
      filter.kycStatus = searchParams.get('kycStatus');
    }
    
    // Exclude sensitive information
    const select = { password: 0 as 0 };
    
    const users = await findMany(User, filter, {
      sort: { createdAt: -1 },
      skip,
      limit,
      select,
    });
    
    const total = await User.countDocuments(filter);
    
    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return serverErrorResponse('Failed to fetch users');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password || !body.fullName) {
      return errorResponse('Missing required fields: email, password, fullName');
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: body.email.toLowerCase() });
    if (existingUser) {
      return errorResponse('Email already registered');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    
    // Create user
    const userData = {
      ...body,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketingEmails: true,
          securityAlerts: true,
          transactionUpdates: true,
          priceAlerts: true,
        },
        language: 'en',
        currency: 'USD',
        timezone: 'UTC',
      },
    };
    
    const user = await createOne(User, userData);
    
    // Remove sensitive information before sending response
    const { password, ...userWithoutPassword } = user.toObject();
    
    return successResponse(userWithoutPassword, 'User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    return serverErrorResponse('Failed to create user');
  }
}
