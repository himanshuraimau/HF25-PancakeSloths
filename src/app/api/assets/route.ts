import { NextRequest } from 'next/server';
import { findMany, createOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import Asset from '@/lib/mongodb/models/Asset';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    // Add filters based on query parameters
    if (searchParams.has('type')) {
      filter.type = searchParams.get('type');
    }
    
    if (searchParams.has('symbol')) {
      filter.symbol = new RegExp(searchParams.get('symbol') as string, 'i');
    }
    
    if (searchParams.has('name')) {
      filter.name = new RegExp(searchParams.get('name') as string, 'i');
    }
    
    // Add price range filter
    if (searchParams.has('minPrice')) {
      filter.currentPrice = {
        ...filter.currentPrice,
        $gte: parseFloat(searchParams.get('minPrice') as string),
      };
    }
    
    if (searchParams.has('maxPrice')) {
      filter.currentPrice = {
        ...filter.currentPrice,
        $lte: parseFloat(searchParams.get('maxPrice') as string),
      };
    }
    
    const assets = await findMany(Asset, filter, {
      sort: { marketCap: -1 },
      skip,
      limit,
    });
    
    const total = await Asset.countDocuments(filter);
    
    return successResponse({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return serverErrorResponse('Failed to fetch assets');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.symbol || !body.type || !body.currentPrice) {
      return errorResponse('Missing required fields: name, symbol, type, currentPrice');
    }
    
    // Check if asset with same symbol already exists
    const existingAsset = await Asset.findOne({ symbol: body.symbol.toUpperCase() });
    if (existingAsset) {
      return errorResponse('Asset with this symbol already exists');
    }
    
    // Format data
    const assetData = {
      ...body,
      symbol: body.symbol.toUpperCase(),
      priceHistory: [{
        price: body.currentPrice,
        timestamp: new Date(),
      }],
      metadata: {
        lastUpdated: new Date(),
        dataSource: body.metadata?.dataSource || 'manual',
        isVerified: false,
      },
      statistics: {
        volume24h: body.statistics?.volume24h || 0,
        high24h: body.statistics?.high24h || body.currentPrice,
        low24h: body.statistics?.low24h || body.currentPrice,
        changePercent24h: body.statistics?.changePercent24h || 0,
      },
    };
    
    const asset = await createOne(Asset, assetData);
    
    return successResponse(asset, 'Asset created successfully');
  } catch (error) {
    console.error('Error creating asset:', error);
    return serverErrorResponse('Failed to create asset');
  }
} 