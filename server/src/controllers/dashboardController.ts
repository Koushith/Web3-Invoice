import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
  // Convert to ObjectId for aggregation queries
  const orgObjectId = new mongoose.Types.ObjectId(organizationId);

  // Get all active invoices (excluding drafts and cancelled)
  const allInvoices = await Invoice.find({
    organizationId,
    status: { $nin: ['draft', 'cancelled'] }
  });

  // Calculate total revenue (all paid invoices)
  const totalRevenue = allInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  // Calculate outstanding (sent, viewed, partial, overdue - but use amountDue which is total - amountPaid)
  const outstanding = allInvoices
    .filter(inv => ['sent', 'viewed', 'partial', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

  // Calculate paid amount (total of all amountPaid across all invoices)
  const totalPaid = allInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

  // Get invoice counts by status (excluding drafts and cancelled)
  const statusCounts = await Invoice.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        status: { $nin: ['draft', 'cancelled'] }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
  ]);

  // Get recent invoices (excluding drafts)
  const recentInvoices = await Invoice.find({
    organizationId,
    status: { $nin: ['draft', 'cancelled'] }
  })
    .populate('customerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent payments
  const recentPayments = await Payment.find({ organizationId, status: 'completed' })
    .populate('invoiceId', 'invoiceNumber')
    .populate('customerId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Calculate average invoice value (only from paid invoices)
  const paidInvoicesList = allInvoices.filter(inv => inv.status === 'paid');
  const averageInvoice = paidInvoicesList.length > 0
    ? totalRevenue / paidInvoicesList.length
    : 0;

  // Get overdue invoices count
  const overdueCount = allInvoices.filter(inv => inv.status === 'overdue').length;

  // Get customer count
  const customerCount = await Customer.countDocuments({ organizationId, isActive: true });

  // Calculate counts for different statuses
  const paidInvoices = allInvoices.filter(inv => inv.status === 'paid').length;
  // Pending invoices are those that are sent/viewed but not yet paid or overdue
  const pendingInvoices = allInvoices.filter(inv => ['sent', 'viewed'].includes(inv.status)).length;
  // Partial invoices (invoices with some payment but not fully paid)
  const partialInvoices = allInvoices.filter(inv => inv.status === 'partial').length;

  // Get customer growth data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const customerGrowth = await Customer.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get top customers by revenue
  const topCustomers = await Invoice.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        status: 'paid',
      },
    },
    {
      $group: {
        _id: '$customerId',
        totalRevenue: { $sum: '$total' },
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer',
      },
    },
    { $unwind: '$customer' },
    {
      $project: {
        name: '$customer.name',
        email: '$customer.email',
        totalRevenue: 1,
        invoiceCount: 1,
      },
    },
  ]);

  res.json({
    data: {
      totalRevenue,
      totalInvoices: allInvoices.length,
      paidInvoices,
      pendingInvoices,
      partialInvoices,
      overdueInvoices: overdueCount,
      averageInvoiceValue: averageInvoice || 0,
      outstandingAmount: outstanding,
      paidAmount: totalPaid,
      customerCount,
      statusBreakdown: statusCounts,
      recentInvoices,
      recentPayments,
      customerGrowth,
      topCustomers,
    },
  });
});

/**
 * Get revenue data for charts (Revenue vs Amount Paid)
 */
export const getRevenueData = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user?.user;
  const { period = 'week' } = req.query;

  if (!user?.organizationId) {
    throw new AppError('Organization not found', 404, 'ORG_NOT_FOUND');
  }

  const organizationId = user.organizationId;
  const orgObjectId = new mongoose.Types.ObjectId(organizationId);

  // Calculate days based on period
  let daysNum = 7;
  if (period === 'month') daysNum = 30;
  if (period === 'year') daysNum = 365;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysNum);

  // Get total revenue (all invoices created/sent in period)
  const totalRevenueData = await Invoice.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        status: { $in: ['sent', 'pending', 'paid', 'overdue'] },
        issueDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$issueDate' },
        },
        amount: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get amount paid (only paid invoices in period)
  const amountPaidData = await Invoice.aggregate([
    {
      $match: {
        organizationId: orgObjectId,
        status: 'paid',
        paidAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$paidAt' },
        },
        amount: { $sum: '$amountPaid' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Merge the two datasets by date
  const dateMap = new Map();

  totalRevenueData.forEach(item => {
    dateMap.set(item._id, {
      date: item._id,
      revenue: item.amount,
      paid: 0,
    });
  });

  amountPaidData.forEach(item => {
    const existing = dateMap.get(item._id);
    if (existing) {
      existing.paid = item.amount;
    } else {
      dateMap.set(item._id, {
        date: item._id,
        revenue: 0,
        paid: item.amount,
      });
    }
  });

  // Convert map to array and sort by date
  const combinedData = Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  res.json({
    data: combinedData,
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
