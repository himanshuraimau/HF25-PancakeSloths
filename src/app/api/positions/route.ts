import { NextRequest } from 'next/server';
import { findMany, findOne, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import TradingPosition from '@/lib/mongodb/models/TradingPosition';

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
    
    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }
    
    const positions = await findMany(TradingPosition, filter, {
      sort: { openedAt: -1 },
      skip,
      limit,
    });
    
    const total = await TradingPosition.countDocuments(filter);
    
    return successResponse({
      positions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return serverErrorResponse('Failed to fetch positions');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.assetId || !body.quantity || !body.averageEntryPrice || !body.currentPrice) {
      return errorResponse('Missing required fields');
    }
    
    // Calculate unrealized PnL
    const unrealizedPnl = (body.currentPrice - body.averageEntryPrice) * body.quantity;
    const unrealizedPnlPercentage = (unrealizedPnl / (body.averageEntryPrice * body.quantity)) * 100;
    
    // Set initial values
    body.status = 'open';
    body.unrealizedPnl = unrealizedPnl;
    body.unrealizedPnlPercentage = unrealizedPnlPercentage;
    body.realizedPnl = 0;
    
    // Create the position
    const position = await createOne(TradingPosition, body);
    
    return successResponse(position, 'Position created successfully');
  } catch (error) {
    console.error('Error creating position:', error);
    return serverErrorResponse('Failed to create position');
  }
} 