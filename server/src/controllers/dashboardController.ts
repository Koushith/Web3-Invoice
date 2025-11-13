import { Request, Response } from 'express';
import { Invoice, Payment, Customer } from '../models';
import { asyncHandler, AppError } from '../middleware';

/**
 * Get dashboard stats and metrics
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const organizationId = user.organizationId;

  // Get all invoices for calculations
  const allInvoices = await Invoice.find({ organizationId });

  // Calculate total revenue (all paid invoices)
  const totalRevenue = allInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  // Calculate outstanding (unpaid + partial + overdue)
  const outstanding = allInvoices
    .filter(inv => ['sent', 'viewed', 'partial', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amountDue, 0);

  // Calculate paid amount
  const totalPaid = allInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

  // Get invoice counts by status
  const statusCounts = await Invoice.aggregate([
    { $match: { organizationId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
  ]);

  // Get recent invoices
  const recentInvoices = await Invoice.find({ organizationId })
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent payments
  const recentPayments = await Payment.find({ organizationId, status: 'completed' })
    .populate('invoiceId', 'invoiceNumber')
    .populate('customerId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Calculate average invoice value
  const averageInvoice = allInvoices.length > 0
    ? totalRevenue / allInvoices.filter(inv => inv.status === 'paid').length
    : 0;

  // Get overdue invoices count
  const overdueCount = allInvoices.filter(inv => inv.status === 'overdue').length;

  // Get customer count
  const customerCount = await Customer.countDocuments({ organizationId, isActive: true });

  // Calculate counts for different statuses
  const paidInvoices = allInvoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = allInvoices.filter(inv => ['sent', 'viewed', 'partial'].includes(inv.status)).length;

  res.json({
    data: {
      totalRevenue,
      totalInvoices: allInvoices.length,
      paidInvoices,
      pendingInvoices,
      overdueInvoices: overdueCount,
      averageInvoiceValue: averageInvoice || 0,
      outstandingAmount: outstanding,
      paidAmount: totalPaid,
      customerCount,
      statusBreakdown: statusCounts,
      recentInvoices,
      recentPayments,
    },
  });
});

/**
 * Get revenue data for charts
 */
export const getRevenueData = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { period = 'week' } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Calculate days based on period
  let daysNum = 7;
  if (period === 'month') daysNum = 30;
  if (period === 'year') daysNum = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysNum);

  const revenueData = await Invoice.aggregate([
    {
      $match: {
        organizationId: user.organizationId,
        status: 'paid',
        paidAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$paidAt' },
        },
        amount: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    data: revenueData.map(item => ({
      date: item._id,
      amount: item.amount,
      invoices: item.count,
    })),
  });
});

/**
 * Get activity feed
 */
export const getActivityFeed = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { limit = 20 } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  // Get recent invoices with status changes
  const recentInvoices = await Invoice.find({
    organizationId: user.organizationId,
  })
    .populate('customerId', 'name')
    .sort({ updatedAt: -1 })
    .limit(Number(limit));

  // Get recent payments
  const recentPayments = await Payment.find({
    organizationId: user.organizationId,
  })
    .populate('invoiceId', 'invoiceNumber')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  // Combine and sort by date
  const activities = [
    ...recentInvoices.map(inv => ({
      type: 'invoice',
      action: inv.status,
      entity: inv.invoiceNumber,
      customer: inv.customerId,
      amount: inv.total,
      date: inv.updatedAt,
    })),
    ...recentPayments.map(pay => ({
      type: 'payment',
      action: pay.status,
      entity: pay.invoiceId,
      amount: pay.amount,
      method: pay.paymentMethod,
      date: pay.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, Number(limit));

  res.json({ data: activities });
});
