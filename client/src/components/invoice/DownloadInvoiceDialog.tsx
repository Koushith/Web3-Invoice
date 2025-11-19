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
import { CloudflareTemplate } from './CloudflareTemplate';
import { cn } from '@/lib/utils';

interface DownloadInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice;
  logo?: string | null;
}

type TemplateStyle = 'standard' | 'modern' | 'minimal' | 'artistic' | 'gradient' | 'glass' | 'elegant' | 'catty' | 'floral' | 'panda' | 'pinkminimal' | 'compactpanda' | 'cloudflare';

const templateNames: Record<TemplateStyle, string> = {
  standard: 'Standard',
  modern: 'Modern',
  minimal: 'Minimal',
  artistic: 'Artistic',
  gradient: 'Professional',
  glass: 'Executive',
  elegant: 'Classic',
  catty: 'Playful',
  floral: 'Dark Floral',
  panda: 'Panda',
  pinkminimal: 'Pink Minimal',
  compactpanda: 'Compact',
  cloudflare: 'Cloudflare',
};

export const DownloadInvoiceDialog = ({ open, onClose, invoice, logo }: DownloadInvoiceDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(
    (invoice.templateStyle as TemplateStyle) || 'standard'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.4);
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
    notes: invoice.notes || '',
    terms: invoice.terms || '',
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
      case 'cloudflare':
        return <CloudflareTemplate {...props} />;
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
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the actual height needed for the image
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If content fits on one page, add it normally
      if (imgHeight <= pdfHeight) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);
      } else {
        // Content needs multiple pages
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add additional pages as needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // negative value
          pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

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
                <SelectItem value="gradient">Professional</SelectItem>
                <SelectItem value="glass">Executive</SelectItem>
                <SelectItem value="elegant">Classic</SelectItem>
                <SelectItem value="catty">Playful</SelectItem>
                <SelectItem value="floral">Dark Floral</SelectItem>
                <SelectItem value="panda">Panda</SelectItem>
                <SelectItem value="pinkminimal">Pink Minimal</SelectItem>
                <SelectItem value="compactpanda">Compact</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
              </SelectContent>
            </Select>
            {invoice.templateStyle && invoice.templateStyle === selectedTemplate && (
              <p className="text-xs text-gray-500 mt-1.5">This is the original template style</p>
            )}
          </div>

          {/* Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Preview</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewZoom(Math.max(0.3, previewZoom - 0.1))}
                  className="h-7 w-7 p-0 text-xs"
                  disabled={previewZoom <= 0.3}
                >
                  <span className="text-lg">−</span>
                </Button>
                <span className="text-xs text-gray-600 w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewZoom(Math.min(1.0, previewZoom + 0.1))}
                  className="h-7 w-7 p-0 text-xs"
                  disabled={previewZoom >= 1.0}
                >
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 overflow-auto" style={{ maxHeight: '500px' }}>
              <div className="flex justify-center">
                <div
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    transform: `scale(${previewZoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <div
                    ref={previewRef}
                    className={cn(
                      "shadow-sm",
                      selectedTemplate === 'cloudflare' ? 'bg-[#F5F5F0]' : 'bg-white'
                    )}
                  >
                    {renderTemplate()}
                  </div>
                </div>
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
