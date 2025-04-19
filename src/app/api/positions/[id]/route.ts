import { NextRequest } from 'next/server';
import { findOne, updateOne, deleteOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import TradingPosition from '@/lib/mongodb/models/TradingPosition';
import Asset from '@/lib/mongodb/models/Asset';
import Order from '@/lib/mongodb/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const position = await findOne(TradingPosition, { _id: params.id });
    
    if (!position) {
      return notFoundResponse('Trading position');
    }
    
    return successResponse(position);
  } catch (error) {
    console.error('Error fetching trading position:', error);
    return serverErrorResponse('Failed to fetch trading position');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPosition = await findOne(TradingPosition, { _id: params.id });
    if (!existingPosition) {
      return notFoundResponse('Trading position');
    }
    
    const body = await request.json();
    
    // Get current asset price
    const asset = await findOne(Asset, { _id: existingPosition.assetId });
    if (!asset) {
      return errorResponse('Associated asset not found');
    }
    
    // Calculate new values
    const updates = {
      ...body,
      currentPrice: asset.currentPrice,
      unrealizedPnl: (body.quantity || existingPosition.quantity) * 
        (asset.currentPrice - (body.averageEntryPrice || existingPosition.averageEntryPrice)),
      updatedAt: new Date(),
    };
    
    // Update the position
    const updatedPosition = await updateOne(TradingPosition, { _id: params.id }, updates);
    
    return successResponse(updatedPosition, 'Trading position updated successfully');
  } catch (error) {
    console.error('Error updating trading position:', error);
    return serverErrorResponse('Failed to update trading position');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingPosition = await findOne(TradingPosition, { _id: params.id });
    if (!existingPosition) {
      return notFoundResponse('Trading position');
    }
    
    // Check if position has any open orders
    const hasOpenOrders = await Order.exists({
      assetId: existingPosition.assetId,
      userId: existingPosition.userId,
      status: { $in: ['open', 'partially_filled'] },
    });
    
    if (hasOpenOrders) {
      return errorResponse('Cannot delete position with open orders');
    }
    
    // Delete the position
    await deleteOne(TradingPosition, { _id: params.id });
    
    return successResponse(null, 'Trading position deleted successfully');
  } catch (error) {
    console.error('Error deleting trading position:', error);
    return serverErrorResponse('Failed to delete trading position');
  }
} 