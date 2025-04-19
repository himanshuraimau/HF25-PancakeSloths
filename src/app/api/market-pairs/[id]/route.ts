import { NextRequest } from 'next/server';
import { findOne, updateOne, deleteOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import MarketPair from '@/lib/mongodb/models/MarketPair';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marketPair = await findOne(MarketPair, { _id: params.id });
    
    if (!marketPair) {
      return notFoundResponse('Market pair');
    }
    
    return successResponse(marketPair);
  } catch (error) {
    console.error('Error fetching market pair:', error);
    return serverErrorResponse('Failed to fetch market pair');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if market pair exists
    const existingPair = await findOne(MarketPair, { _id: params.id });
    if (!existingPair) {
      return notFoundResponse('Market pair');
    }
    
    // If base or quote asset is being updated, check if the new pair already exists
    if (
      (body.baseAssetId && body.baseAssetId !== existingPair.baseAssetId) ||
      (body.quoteAssetId && body.quoteAssetId !== existingPair.quoteAssetId)
    ) {
      const newBaseAssetId = body.baseAssetId || existingPair.baseAssetId;
      const newQuoteAssetId = body.quoteAssetId || existingPair.quoteAssetId;
      
      const pairExists = await findOne(MarketPair, {
        baseAssetId: newBaseAssetId,
        quoteAssetId: newQuoteAssetId,
        _id: { $ne: params.id },
      });
      
      if (pairExists) {
        return errorResponse('Market pair already exists');
      }
    }
    
    // Update the market pair
    const updatedPair = await updateOne(MarketPair, { _id: params.id }, body);
    
    return successResponse(updatedPair, 'Market pair updated successfully');
  } catch (error) {
    console.error('Error updating market pair:', error);
    return serverErrorResponse('Failed to update market pair');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if market pair exists
    const existingPair = await findOne(MarketPair, { _id: params.id });
    if (!existingPair) {
      return notFoundResponse('Market pair');
    }
    
    // Delete the market pair
    const deleted = await deleteOne(MarketPair, { _id: params.id });
    
    if (!deleted) {
      return errorResponse('Failed to delete market pair');
    }
    
    return successResponse(null, 'Market pair deleted successfully');
  } catch (error) {
    console.error('Error deleting market pair:', error);
    return serverErrorResponse('Failed to delete market pair');
  }
} 