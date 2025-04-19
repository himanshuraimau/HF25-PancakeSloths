import { NextRequest } from 'next/server';
import { findOne, updateOne, deleteOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import Asset from '@/lib/mongodb/models/Asset';
import TradingPosition from '@/lib/mongodb/models/TradingPosition';
import Order from '@/lib/mongodb/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await findOne(Asset, { _id: params.id });
    
    if (!asset) {
      return notFoundResponse('Asset');
    }
    
    return successResponse(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return serverErrorResponse('Failed to fetch asset');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAsset = await findOne(Asset, { _id: params.id });
    if (!existingAsset) {
      return notFoundResponse('Asset');
    }
    
    const body = await request.json();
    
    // If price is being updated, add to price history
    if (body.currentPrice && body.currentPrice !== existingAsset.currentPrice) {
      body.priceHistory = [
        ...(existingAsset.priceHistory || []),
        {
          price: body.currentPrice,
          timestamp: new Date(),
        },
      ];
      
      // Update statistics
      body.statistics = {
        ...existingAsset.statistics,
        high24h: Math.max(body.currentPrice, existingAsset.statistics?.high24h || body.currentPrice),
        low24h: Math.min(body.currentPrice, existingAsset.statistics?.low24h || body.currentPrice),
        changePercent24h: ((body.currentPrice - existingAsset.currentPrice) / existingAsset.currentPrice) * 100,
      };
    }
    
    // Update metadata
    if (body.metadata || body.currentPrice) {
      body.metadata = {
        ...existingAsset.metadata,
        ...body.metadata,
        lastUpdated: new Date(),
      };
    }
    
    // Update the asset
    const updatedAsset = await updateOne(Asset, { _id: params.id }, body);
    
    return successResponse(updatedAsset, 'Asset updated successfully');
  } catch (error) {
    console.error('Error updating asset:', error);
    return serverErrorResponse('Failed to update asset');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAsset = await findOne(Asset, { _id: params.id });
    if (!existingAsset) {
      return notFoundResponse('Asset');
    }
    
    // Check if asset has any associated positions or orders
    const hasPositions = await TradingPosition.exists({ assetId: params.id });
    const hasOrders = await Order.exists({ assetId: params.id });
    
    if (hasPositions || hasOrders) {
      return errorResponse('Cannot delete asset with existing positions or orders');
    }
    
    // Delete the asset
    await deleteOne(Asset, { _id: params.id });
    
    return successResponse(null, 'Asset deleted successfully');
  } catch (error) {
    console.error('Error deleting asset:', error);
    return serverErrorResponse('Failed to delete asset');
  }
} 