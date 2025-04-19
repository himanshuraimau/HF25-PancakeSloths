import { NextRequest } from 'next/server';
import { findMany, findOne, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import MarketPair from '@/lib/mongodb/models/MarketPair';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    // Add filters based on query parameters
    if (searchParams.has('baseAssetId')) {
      filter.baseAssetId = searchParams.get('baseAssetId');
    }
    
    if (searchParams.has('quoteAssetId')) {
      filter.quoteAssetId = searchParams.get('quoteAssetId');
    }
    
    if (searchParams.has('isActive')) {
      filter.isActive = searchParams.get('isActive') === 'true';
    }
    
    const marketPairs = await findMany(MarketPair, filter, {
      sort: { volume24h: -1 },
      skip,
      limit,
    });
    
    const total = await MarketPair.countDocuments(filter);
    
    return successResponse({
      marketPairs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching market pairs:', error);
    return serverErrorResponse('Failed to fetch market pairs');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if market pair already exists
    const existingPair = await findOne(MarketPair, {
      baseAssetId: body.baseAssetId,
      quoteAssetId: body.quoteAssetId,
    });
    
    if (existingPair) {
      return errorResponse('Market pair already exists');
    }
    
    // Create the market pair
    const marketPair = await createOne(MarketPair, body);
    
    return successResponse(marketPair, 'Market pair created successfully');
  } catch (error) {
    console.error('Error creating market pair:', error);
    return serverErrorResponse('Failed to create market pair');
  }
} 