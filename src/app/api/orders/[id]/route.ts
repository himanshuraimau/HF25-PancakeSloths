import { NextRequest } from 'next/server';
import { findOne, updateOne, deleteOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import Order from '@/lib/mongodb/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await findOne(Order, { _id: params.id });
    
    if (!order) {
      return notFoundResponse('Order');
    }
    
    return successResponse(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return serverErrorResponse('Failed to fetch order');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if order exists
    const existingOrder = await findOne(Order, { _id: params.id });
    if (!existingOrder) {
      return notFoundResponse('Order');
    }
    
    // Only allow certain fields to be updated
    const allowedUpdates = [
      'status',
      'filledQuantity',
      'averageFilledPrice',
      'remainingQuantity',
      'cancelReason',
      'trades',
    ];
    
    const updates: any = {};
    
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }
    
    // If the order is being filled, update the status
    if (updates.filledQuantity !== undefined) {
      if (updates.filledQuantity === existingOrder.quantity) {
        updates.status = 'filled';
      } else if (updates.filledQuantity > 0) {
        updates.status = 'partially_filled';
      }
    }
    
    // If the order is being cancelled, update the status
    if (body.status === 'cancelled') {
      updates.status = 'cancelled';
      updates.cancelReason = body.cancelReason || 'Cancelled by user';
    }
    
    // Update the order
    const updatedOrder = await updateOne(Order, { _id: params.id }, updates);
    
    return successResponse(updatedOrder, 'Order updated successfully');
  } catch (error) {
    console.error('Error updating order:', error);
    return serverErrorResponse('Failed to update order');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if order exists
    const existingOrder = await findOne(Order, { _id: params.id });
    if (!existingOrder) {
      return notFoundResponse('Order');
    }
    
    // Only allow deletion of open or partially filled orders
    if (existingOrder.status !== 'open' && existingOrder.status !== 'partially_filled') {
      return errorResponse('Cannot delete filled, cancelled, rejected, or expired orders');
    }
    
    // Delete the order
    const deleted = await deleteOne(Order, { _id: params.id });
    
    if (!deleted) {
      return errorResponse('Failed to delete order');
    }
    
    return successResponse(null, 'Order deleted successfully');
  } catch (error) {
    console.error('Error deleting order:', error);
    return serverErrorResponse('Failed to delete order');
  }
} 