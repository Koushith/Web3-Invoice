import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateInvoiceMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  currentDueDate?: string | Date;
  onSuccess?: () => void;
}

export const EditDetailsDialog = ({ open, onClose, invoiceId, currentDueDate, onSuccess }: EditDetailsDialogProps) => {
  const [dueDate, setDueDate] = useState('');
  const [updateInvoice, { isLoading }] = useUpdateInvoiceMutation();

  useEffect(() => {
    if (currentDueDate) {
      const date = new Date(currentDueDate);
      const formattedDate = date.toISOString().split('T')[0];
      setDueDate(formattedDate);
    }
  }, [currentDueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateInvoice({
        id: invoiceId,
        data: { dueDate },
      }).unwrap();

      toast.success('Details updated successfully');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error?.data?.message || 'Failed to update details');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2 h-10"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#635BFF] hover:bg-[#5045e5]">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
