import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RecordPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  invoiceTotal: number;
  amountDue: number;
  currency?: string;
  onSuccess?: () => void;
}

export const RecordPaymentDialog = ({
  open,
  onClose,
  invoiceId,
  invoiceTotal,
  amountDue,
  currency = 'USD',
  onSuccess,
}: RecordPaymentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amountPaid: amountDue.toString(),
    paymentMethod: 'bank_transfer',
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'card', label: 'Card' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amountPaid);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (amount > amountDue) {
      toast.error(`Payment amount cannot exceed the amount due (${currency} ${amountDue.toFixed(2)})`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          amountPaid: amount,
          paymentMethod: formData.paymentMethod,
          transactionReference: formData.transactionReference || undefined,
          paymentDate: formData.paymentDate,
          notes: formData.notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to record payment');
      }

      toast.success('Payment recorded successfully!', {
        description: `${currency} ${amount.toFixed(2)} has been recorded.`,
      });

      // Reset form
      setFormData({
        amountPaid: amountDue.toString(),
        paymentMethod: 'bank_transfer',
        transactionReference: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to record payment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get auth token from Firebase
  const getAuthToken = async () => {
    const { auth } = await import('@/lib/firebase');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    return currentUser.getIdToken();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment received for this invoice. Amount due: {currency} {amountDue.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount Received <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {currency}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={amountDue}
                placeholder="0.00"
                value={formData.amountPaid}
                onChange={(e) => handleChange('amountPaid', e.target.value)}
                className="pl-16"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Invoice total: {currency} {invoiceTotal.toFixed(2)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Payment Method <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="paymentDate">
              Payment Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleChange('paymentDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Transaction Reference */}
          <div className="space-y-2">
            <Label htmlFor="transactionReference">Transaction Reference (Optional)</Label>
            <Input
              id="transactionReference"
              type="text"
              placeholder="e.g., Check #1234, Transfer ID"
              value={formData.transactionReference}
              onChange={(e) => handleChange('transactionReference', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this payment..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#635bff] hover:bg-[#5045e5]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
