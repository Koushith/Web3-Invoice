import mongoose from 'mongoose';
import cron from 'node-cron';
import Invoice from '../models/Invoice';

// Calculate next date based on interval
const getNextDate = (date: Date, interval: string): Date => {
  const nextDate = new Date(date);
  switch (interval) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  return nextDate;
};

// Generate next invoice number
// This is a simplified version. Ideally we should use the same logic as the invoice controller
const generateNextInvoiceNumber = async (organizationId: mongoose.Types.ObjectId, currentNumber: string): Promise<string> => {
  // Try to parse prefix and number
  const parts = currentNumber.split('-');
  if (parts.length < 2) return `${currentNumber}-COPY`; // Fallback

  const prefix = parts[0];
  const numberStr = parts[1];
  const numberLen = numberStr.length;
  
  // Find highest number for this prefix in org
  const latestInvoice = await Invoice.findOne({
    organizationId,
    invoiceNumber: new RegExp(`^${prefix}-\\d+$`)
  }).sort({ createdAt: -1 });

  let nextNum = 1;
  if (latestInvoice) {
    const latestParts = latestInvoice.invoiceNumber.split('-');
    if (latestParts.length >= 2) {
      const latestNum = parseInt(latestParts[1], 10);
      if (!isNaN(latestNum)) {
        nextNum = latestNum + 1;
      }
    }
  }

  return `${prefix}-${String(nextNum).padStart(numberLen, '0')}`;
};

export const startRecurringInvoiceScheduler = () => {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running recurring invoice scheduler...');
    
    try {
      const today = new Date();
      
      // Find invoices due for recurrence
      // Criteria:
      // 1. isRecurring is true
      // 2. Status is not cancelled
      // 3. nextRecurringAt is due (<= today) OR (nextRecurringAt is not set AND lastRecurringAt + interval <= today)
      //    Note: If nextRecurringAt is missing, we assume it was just created or legacy.
      //    We'll focus on nextRecurringAt which we added to the model.
      
      const dueInvoices = await Invoice.find({
        isRecurring: true,
        status: { $ne: 'cancelled' },
        $or: [
          { nextRecurringAt: { $lte: today } },
          // Fallback for first run if nextRecurringAt wasn't set but it's recurring
          { 
            nextRecurringAt: { $exists: false },
            createdAt: { $lte: today } // This might be too aggressive, but let's assume newly created ones have nextRecurringAt set by controller
          }
        ],
        // Check end date if exists
        $and: [
          {
            $or: [
              { recurringEndDate: { $exists: false } },
              { recurringEndDate: { $eq: null } },
              { recurringEndDate: { $gte: today } }
            ]
          }
        ]
      });

      console.log(`Found ${dueInvoices.length} recurring invoices due.`);

      for (const parentInvoice of dueInvoices) {
        try {
          // Double check if we should generate
          // If nextRecurringAt is NOT set, we should probably set it first and skip generation to avoid duplicate bursts?
          // Or we assume the user wanted one "Interval" after creation.
          
          let nextDate = parentInvoice.nextRecurringAt;
          if (!nextDate) {
            // If missing, calculate from createdAt or lastRecurringAt
            const baseDate = parentInvoice.lastRecurringAt || parentInvoice.createdAt;
            nextDate = getNextDate(baseDate, parentInvoice.recurringInterval || 'monthly');
            
            // If calculated next date is still in future, create it then
            if (nextDate > today) {
              parentInvoice.nextRecurringAt = nextDate;
              await parentInvoice.save();
              continue;
            }
          }

          // Generate New Invoice
          const newInvoiceNumber = await generateNextInvoiceNumber(parentInvoice.organizationId, parentInvoice.invoiceNumber);

          const newInvoice = new Invoice({
            organizationId: parentInvoice.organizationId,
            customerId: parentInvoice.customerId,
            invoiceNumber: newInvoiceNumber,
            status: 'sent', // Auto-send? Or draft? Let's say 'sent' for now.
            issueDate: new Date(),
            dueDate: parentInvoice.dueDate ? new Date(Date.now() + (parentInvoice.dueDate.getTime() - parentInvoice.issueDate.getTime())) : undefined,
            currency: parentInvoice.currency,
            lineItems: parentInvoice.lineItems,
            subtotal: parentInvoice.subtotal,
            taxRate: parentInvoice.taxRate,
            taxAmount: parentInvoice.taxAmount,
            total: parentInvoice.total,
            amountPaid: 0,
            amountDue: parentInvoice.total,
            notes: parentInvoice.notes,
            terms: parentInvoice.terms,
            templateStyle: parentInvoice.templateStyle,
            allowedPaymentMethods: parentInvoice.allowedPaymentMethods,
            
            // Link to parent
            parentInvoiceId: parentInvoice._id,
            
            // New invoice is NOT recurring itself (it's a child)
            isRecurring: false,
            
            createdBy: parentInvoice.createdBy
          });

          await newInvoice.save();
          console.log(`✅ Generated recurring invoice ${newInvoice.invoiceNumber} from ${parentInvoice.invoiceNumber}`);

          // Update Parent
          parentInvoice.lastRecurringAt = new Date();
          parentInvoice.nextRecurringAt = getNextDate(new Date(), parentInvoice.recurringInterval || 'monthly');
          await parentInvoice.save();

        } catch (err) {
          console.error(`❌ Error processing recurring invoice ${parentInvoice._id}:`, err);
        }
      }

    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  });
};
