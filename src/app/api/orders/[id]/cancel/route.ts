import { NextRequest } from 'next/server';
import { findOne, updateOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import Order from '@/lib/mongodb/models/Order';

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
    
    // Only allow cancellation of open or partially filled orders
    if (existingOrder.status !== 'open' && existingOrder.status !== 'partially_filled') {
      return errorResponse('Cannot cancel filled, cancelled, rejected, or expired orders');
    }
    
    const body = await request.json();
    
    // Update the order status to cancelled
    const updates = {
      status: 'cancelled',
      cancelReason: body.reason || 'Cancelled by user',
      updatedAt: new Date(),
    };
    
    // Update the order
    const updatedOrder = await updateOne(Order, { _id: params.id }, updates);
    
    return successResponse(updatedOrder, 'Order cancelled successfully');
  } catch (error) {
    console.error('Error cancelling order:', error);
    return serverErrorResponse('Failed to cancel order');
  }
} 