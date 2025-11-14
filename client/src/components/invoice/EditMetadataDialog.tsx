import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateInvoiceMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';

interface EditMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  currentMetadata?: Record<string, any>;
  onSuccess?: () => void;
}

export const EditMetadataDialog = ({ open, onClose, invoiceId, currentMetadata, onSuccess }: EditMetadataDialogProps) => {
  const [metadata, setMetadata] = useState<Array<{ key: string; value: string }>>([]);
  const [updateInvoice, { isLoading }] = useUpdateInvoiceMutation();

  useEffect(() => {
    if (currentMetadata && Object.keys(currentMetadata).length > 0) {
      setMetadata(
        Object.entries(currentMetadata).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      );
    } else {
      setMetadata([{ key: '', value: '' }]);
    }
  }, [currentMetadata, open]);

  const addMetadataField = () => {
    setMetadata([...metadata, { key: '', value: '' }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };

  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...metadata];
    updated[index][field] = value;
    setMetadata(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert array to object
    const metadataObject: Record<string, string> = {};
    metadata.forEach(({ key, value }) => {
      if (key.trim()) {
        metadataObject[key.trim()] = value;
      }
    });

    console.log('Updating metadata:', metadataObject);

    try {
      const result = await updateInvoice({
        id: invoiceId,
        data: { metadata: metadataObject },
      }).unwrap();

      console.log('Metadata update result:', result);
      toast.success('Metadata updated successfully');
      onClose();
      // Call onSuccess after close to trigger refetch
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error?.data?.message || 'Failed to update metadata');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Metadata</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-3">
            {metadata.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Label htmlFor={`key-${index}`} className="text-xs text-gray-500">
                    Key
                  </Label>
                  <Input
                    id={`key-${index}`}
                    value={item.key}
                    onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                    placeholder="e.g., order_id"
                    className="h-9 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`value-${index}`} className="text-xs text-gray-500">
                    Value
                  </Label>
                  <Input
                    id={`value-${index}`}
                    value={item.value}
                    onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                    placeholder="e.g., 12345"
                    className="h-9 mt-1"
                  />
                </div>
                {metadata.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMetadataField(index)}
                    className="h-9 w-9 p-0 mt-6 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMetadataField}
            className="w-full h-9 text-sm border-dashed"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add field
          </Button>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
