import { NextRequest } from 'next/server';
import { findMany, findOne } from '@/lib/mongodb/utils';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response';
import User from '@/lib/mongodb/models/User';
import TradingPosition from '@/lib/mongodb/models/TradingPosition';
import Order from '@/lib/mongodb/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';
    
    // Check if user exists
    const user = await findOne(User, { _id: params.id });
    if (!user) {
      return notFoundResponse('User');
    }
    
    // Calculate date range based on timeframe
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
    
    // Get all positions for the user
    const positions = await findMany(TradingPosition, { userId: params.id });
    
    // Get all orders for the user within the timeframe
    const orders = await findMany(Order, {
      userId: params.id,
      createdAt: { $gte: startDate },
    });
    
    // Calculate statistics
    const totalPositions = positions.length;
    const openPositions = positions.filter((p: any) => p.quantity > 0).length;
    const closedPositions = positions.filter((p: any) => p.quantity === 0).length;
    
    const totalOrders = orders.length;
    const buyOrders = orders.filter((o: any) => o.side === 'buy').length;
    const sellOrders = orders.filter((o: any) => o.side === 'sell').length;
    
    const filledOrders = orders.filter((o: any) => o.status === 'filled').length;
    const cancelledOrders = orders.filter((o: any) => o.status === 'cancelled').length;
    
    // Calculate total volume
    const totalVolume = orders.reduce((sum: number, order: any) => {
      if (order.status === 'filled') {
        return sum + (order.filledQuantity * order.averageFilledPrice);
      }
      return sum;
    }, 0);
    
    // Calculate total PnL
    const totalPnl = positions.reduce((sum: number, position: any) => {
      return sum + (position.unrealizedPnl || 0);
    }, 0);
    
    // Calculate win rate
    const profitablePositions = positions.filter((p: any) => p.unrealizedPnl > 0).length;
    const winRate = totalPositions > 0 ? (profitablePositions / totalPositions) * 100 : 0;
    
    // Get most traded assets
    const assetCounts: Record<string, number> = {};
    orders.forEach((order: any) => {
      if (order.status === 'filled') {
        const assetId = order.assetId.toString();
        assetCounts[assetId] = (assetCounts[assetId] || 0) + 1;
      }
    });
    
    const mostTradedAssets = Object.entries(assetCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([assetId, count]) => ({ assetId, count }));
    
    return successResponse({
      userId: params.id,
      timeframe,
      positions: {
        total: totalPositions,
        open: openPositions,
        closed: closedPositions,
      },
      orders: {
        total: totalOrders,
        buy: buyOrders,
        sell: sellOrders,
        filled: filledOrders,
        cancelled: cancelledOrders,
      },
      performance: {
        totalVolume,
        totalPnl,
        winRate,
      },
      mostTradedAssets,
    });
  } catch (error) {
    console.error('Error fetching trading statistics:', error);
    return serverErrorResponse('Failed to fetch trading statistics');
  }
} 