import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';
import { Invoice } from '@/types/models';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  StandardTemplate,
  ModernTemplate,
  MinimalTemplate,
  ArtisticTemplate,
  GradientTemplate,
  GlassTemplate,
  ElegantTemplate,
  CattyTemplate,
  FloralTemplate,
  PandaTemplate,
  PinkMinimalTemplate,
  CompactPandaTemplate,
} from './InvoiceTemplates';

interface DownloadInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  logo?: string | null;
}

type TemplateStyle = 'standard' | 'modern' | 'minimal' | 'artistic' | 'gradient' | 'glass' | 'elegant' | 'catty' | 'floral' | 'panda' | 'pinkminimal' | 'compactpanda';

const templateNames: Record<TemplateStyle, string> = {
  standard: 'Standard',
  modern: 'Modern',
  minimal: 'Minimal',
  artistic: 'Artistic',
  gradient: 'Gradient',
  glass: 'Glass',
  elegant: 'Elegant',
  catty: 'Playful',
  floral: 'Dark Floral',
  panda: 'Panda',
  pinkminimal: 'Pink Minimal',
  compactpanda: 'Compact',
};

export const DownloadInvoiceDialog = ({ open, onClose, invoice, logo }: DownloadInvoiceDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(
    (invoice.templateStyle as TemplateStyle) || 'standard'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const invoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    date: new Date(invoice.issueDate).toLocaleDateString(),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '',
    memo: invoice.notes || '',
    fromCompany: invoice.organization?.name || '',
    fromAddress: invoice.organization?.address
      ? `${invoice.organization.address.street || ''}\n${invoice.organization.address.city || ''}, ${invoice.organization.address.state || ''} ${invoice.organization.address.postalCode || ''}\n${invoice.organization.address.country || ''}`
      : '',
    toCompany: invoice.customer?.company || invoice.customer?.name || '',
    toAddress: invoice.customer?.address
      ? `${invoice.customer.address.street || ''}\n${invoice.customer.address.city || ''}, ${invoice.customer.address.state || ''} ${invoice.customer.address.postalCode || ''}\n${invoice.customer.address.country || ''}`
      : '',
    items: invoice.items?.map(item => ({
      description: item.description,
      quantity: item.quantity,
      price: item.unitPrice,
    })) || [],
    notes: invoice.terms || '',
  };

  const paymentDetails = {
    method: 'bank' as const,
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      swiftCode: '',
    },
  };

  const renderTemplate = () => {
    const props = {
      logo: logo || null,
      invoiceData,
      paymentDetails,
    };

    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'artistic':
        return <ArtisticTemplate {...props} />;
      case 'gradient':
        return <GradientTemplate {...props} />;
      case 'glass':
        return <GlassTemplate {...props} />;
      case 'elegant':
        return <ElegantTemplate {...props} />;
      case 'catty':
        return <CattyTemplate {...props} />;
      case 'floral':
        return <FloralTemplate {...props} />;
      case 'panda':
        return <PandaTemplate {...props} />;
      case 'pinkminimal':
        return <PinkMinimalTemplate {...props} />;
      case 'compactpanda':
        return <CompactPandaTemplate {...props} />;
      default:
        return <StandardTemplate {...props} />;
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);
    try {
      // Generate PNG from the invoice template
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}-${templateNames[selectedTemplate]}.pdf`);

      onClose();
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="template" className="text-sm font-medium text-gray-700 mb-2 block">
              Select Template Style
            </Label>
            <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as TemplateStyle)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="catty">Playful</SelectItem>
                <SelectItem value="floral">Dark Floral</SelectItem>
                <SelectItem value="panda">Panda</SelectItem>
                <SelectItem value="pinkminimal">Pink Minimal</SelectItem>
                <SelectItem value="compactpanda">Compact</SelectItem>
              </SelectContent>
            </Select>
            {invoice.templateStyle && invoice.templateStyle === selectedTemplate && (
              <p className="text-xs text-gray-500 mt-1.5">This is the original template style</p>
            )}
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
            <div className="bg-white rounded shadow-sm overflow-hidden" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '400px' }}>
              <div ref={previewRef}>
                {renderTemplate()}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isDownloading}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading} className="bg-[#635BFF] hover:bg-[#5045e5]">
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
