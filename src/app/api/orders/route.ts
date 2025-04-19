import { NextRequest } from 'next/server';
import { findMany, findOne, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import Order from '@/lib/mongodb/models/Order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    // Add filters based on query parameters
    if (searchParams.has('userId')) {
      filter.userId = searchParams.get('userId');
    }
    
    if (searchParams.has('assetId')) {
      filter.assetId = searchParams.get('assetId');
    }
    
    if (searchParams.has('type')) {
      filter.type = searchParams.get('type');
    }
    
    if (searchParams.has('side')) {
      filter.side = searchParams.get('side');
    }
    
    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }
    
    const orders = await findMany(Order, filter, {
      sort: { createdAt: -1 },
      skip,
      limit,
    });
    
    const total = await Order.countDocuments(filter);
    
    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return serverErrorResponse('Failed to fetch orders');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.assetId || !body.type || !body.side || !body.quantity || !body.price) {
      return errorResponse('Missing required fields');
    }
    
    // Set initial values
    body.status = 'open';
    body.filledQuantity = 0;
    body.remainingQuantity = body.quantity;
    
    // Create the order
    const order = await createOne(Order, body);
    
    return successResponse(order, 'Order created successfully');
  } catch (error) {
    console.error('Error creating order:', error);
    return serverErrorResponse('Failed to create order');
  }
} 