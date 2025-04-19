import { NextRequest } from 'next/server';
import { findOne, updateOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import Order from '@/lib/mongodb/models/Order';
import TradingPosition from '@/lib/mongodb/models/TradingPosition';
import Asset from '@/lib/mongodb/models/Asset';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if order exists
    const existingOrder = await findOne(Order, { _id: params.id });
    if (!existingOrder) {
      return notFoundResponse('Order');
    }
    
    // Only allow filling of open or partially filled orders
    if (existingOrder.status !== 'open' && existingOrder.status !== 'partially_filled') {
      return errorResponse('Cannot fill cancelled, rejected, or expired orders');
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.quantity || !body.price) {
      return errorResponse('Missing required fields: quantity and price');
    }
    
    // Validate quantity
    const fillQuantity = Number(body.quantity);
    if (fillQuantity <= 0 || fillQuantity > existingOrder.remainingQuantity) {
      return errorResponse('Invalid fill quantity');
    }
    
    // Calculate new values
    const newFilledQuantity = existingOrder.filledQuantity + fillQuantity;
    const newRemainingQuantity = existingOrder.quantity - newFilledQuantity;
    const newAverageFilledPrice = (
      (existingOrder.filledQuantity * (existingOrder.averageFilledPrice || 0) + fillQuantity * body.price) /
      newFilledQuantity
    );
    
    // Create trade record
    const trade = {
      quantity: fillQuantity,
      price: body.price,
      timestamp: new Date(),
    };
    
    // Update order status
    const status = newFilledQuantity === existingOrder.quantity ? 'filled' : 'partially_filled';
    
    // Update the order
    const updates = {
      status,
      filledQuantity: newFilledQuantity,
      remainingQuantity: newRemainingQuantity,
      averageFilledPrice: newAverageFilledPrice,
      trades: [...(existingOrder.trades || []), trade],
      updatedAt: new Date(),
    };
    
    const updatedOrder = await updateOne(Order, { _id: params.id }, updates);
    
    // Update or create trading position
    const position = await findOne(TradingPosition, {
      userId: existingOrder.userId,
      assetId: existingOrder.assetId,
    });
    
    const asset = await findOne(Asset, { _id: existingOrder.assetId });
    if (!asset) {
      return errorResponse('Asset not found');
    }
    
    if (position) {
      // Update existing position
      const newQuantity = existingOrder.side === 'buy'
        ? position.quantity + fillQuantity
        : position.quantity - fillQuantity;
      
      const newAverageEntryPrice = existingOrder.side === 'buy'
        ? (position.quantity * position.averageEntryPrice + fillQuantity * body.price) / newQuantity
        : position.averageEntryPrice;
      
      const positionUpdates = {
        quantity: newQuantity,
        averageEntryPrice: newAverageEntryPrice,
        currentPrice: asset.currentPrice,
        unrealizedPnl: newQuantity * (asset.currentPrice - newAverageEntryPrice),
        updatedAt: new Date(),
      };
      
      await updateOne(TradingPosition, { _id: position._id }, positionUpdates);
    } else if (existingOrder.side === 'buy') {
      // Create new position for buy orders only
      await TradingPosition.create({
        userId: existingOrder.userId,
        assetId: existingOrder.assetId,
        quantity: fillQuantity,
        averageEntryPrice: body.price,
        currentPrice: asset.currentPrice,
        unrealizedPnl: fillQuantity * (asset.currentPrice - body.price),
      });
    }
    
    return successResponse(updatedOrder, 'Order filled successfully');
  } catch (error) {
    console.error('Error filling order:', error);
    return serverErrorResponse('Failed to fill order');
  }
} 