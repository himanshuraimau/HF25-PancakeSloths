import { NextRequest } from 'next/server';
import { findOne, updateOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import Asset from '@/lib/mongodb/models/Asset';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const timeframe = searchParams.get('timeframe') || 'all';
    
    const asset = await findOne(Asset, { _id: params.id });
    
    if (!asset) {
      return notFoundResponse('Asset');
    }
    
    // Filter price history based on timeframe
    let priceHistory = asset.priceHistory || [];
    
    if (timeframe !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeframe) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '1w':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1m':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '3m':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // All time
      }
      
      priceHistory = priceHistory.filter(
        (entry: any) => new Date(entry.timestamp) >= startDate
      );
    }
    
    // Limit the number of entries
    if (priceHistory.length > limit) {
      priceHistory = priceHistory.slice(-limit);
    }
    
    return successResponse({
      assetId: asset._id,
      symbol: asset.symbol,
      name: asset.name,
      priceHistory,
    });
  } catch (error) {
    console.error('Error fetching asset price history:', error);
    return serverErrorResponse('Failed to fetch asset price history');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAsset = await findOne(Asset, { _id: params.id });
    if (!existingAsset) {
      return notFoundResponse('Asset');
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.price) {
      return errorResponse('Price is required');
    }
    
    // Create new price history entry
    const newPriceEntry = {
      price: body.price,
      timestamp: body.timestamp || new Date(),
    };
    
    // Update asset with new price and price history
    const updates = {
      currentPrice: body.price,
      priceHistory: [...(existingAsset.priceHistory || []), newPriceEntry],
      'metadata.lastUpdated': new Date(),
    };
    
    // Update statistics if provided
    if (body.statistics) {
      updates.statistics = {
        ...existingAsset.statistics,
        ...body.statistics,
      };
    }
    
    // Update the asset
    const updatedAsset = await updateOne(Asset, { _id: params.id }, updates);
    
    return successResponse(updatedAsset, 'Asset price history updated successfully');
  } catch (error) {
    console.error('Error updating asset price history:', error);
    return serverErrorResponse('Failed to update asset price history');
  }
} 