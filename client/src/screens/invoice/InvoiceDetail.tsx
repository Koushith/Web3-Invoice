import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Send, MoreVertical, Copy, Edit2, User, CreditCard, Info, Link2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DetailSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useGetInvoiceQuery, useSendInvoiceMutation } from '@/services/api.service';
import { toast } from 'sonner';
import { RecordPaymentDialog } from '@/components/invoice/RecordPaymentDialog';
import { EditDetailsDialog } from '@/components/invoice/EditDetailsDialog';
import { EditMetadataDialog } from '@/components/invoice/EditMetadataDialog';
import { DownloadInvoiceDialog } from '@/components/invoice/DownloadInvoiceDialog';

export const InvoiceDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  const { data: invoice, isLoading, error, refetch } = useGetInvoiceQuery(id!, {
    refetchOnMountOrArgChange: true,
  });
  const [sendInvoice, { isLoading: isSending }] = useSendInvoiceMutation();

  // Log invoice data for debugging
  console.log('Invoice data:', invoice);

  const handleSendInvoice = async () => {
    if (!id) return;

    try {
      const result = await sendInvoice(id).unwrap();

      // Auto-copy the link to clipboard
      let linkCopied = false;
      if (result.publicUrl) {
        try {
          await navigator.clipboard.writeText(result.publicUrl);
          linkCopied = true;
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      }

      // Determine if we're sending a receipt or invoice
      const isPaid = invoice.status === 'paid';
      const documentType = isPaid ? 'Receipt' : 'Invoice';
      const documentTypeLower = isPaid ? 'receipt' : 'invoice';

      // Show success message with email status and clipboard info
      if (result.emailSent) {
        toast.success(`${documentType} sent via email!`, {
          description: linkCopied
            ? `Email sent to customer and ${documentTypeLower} link copied to clipboard.`
            : `The ${documentTypeLower} has been emailed to the customer.`,
        });
      } else {
        toast.success(`${documentType} marked as sent!`, {
          description: result.emailError
            ? `Email delivery failed: ${result.emailError}. ${linkCopied ? `${documentType} link copied to clipboard.` : `The ${documentTypeLower} link is available.`}`
            : linkCopied
              ? `${documentType} link copied to clipboard.`
              : `The ${documentTypeLower} link is now available.`,
        });
      }
    } catch (err: any) {
      console.error('Failed to send invoice:', err);
      const isPaid = invoice.status === 'paid';
      toast.error(err?.data?.message || `Failed to send ${isPaid ? 'receipt' : 'invoice'}`);
    }
  };

  const copyInvoiceLink = async () => {
    if (!invoice?.publicId) {
      toast.error('Public link not available for this invoice');
      return;
    }

    const publicUrl = `${window.location.origin}/invoice/${invoice.publicId}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success('Invoice link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#FEFFFE] flex items-center justify-center p-4">
        <EmptyState
          icon={AlertCircle}
          title="Invoice not found"
          description="The invoice you are looking for does not exist or has been removed."
          actionLabel="Back to Invoices"
          onAction={() => navigate('/invoices')}
        />
      </div>
    );
  }

  const getStatusBadge = (status: string, large = false) => {
    const sizeClasses = large ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';

    switch (status) {
      case 'paid':
        return <span className={`inline-flex items-center rounded font-semibold bg-green-50 text-green-700 border border-green-200 ${sizeClasses}`}>Paid</span>;
      case 'pending':
        return <span className={`inline-flex items-center rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>Pending</span>;
      case 'overdue':
        return <span className={`inline-flex items-center rounded font-semibold bg-red-50 text-red-700 border border-red-200 ${sizeClasses}`}>Overdue</span>;
      case 'draft':
        return <span className={`inline-flex items-center rounded font-semibold bg-gray-50 text-gray-700 border border-gray-200 ${sizeClasses}`}>Draft</span>;
      case 'sent':
        return <span className={`inline-flex items-center rounded font-semibold bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}>Sent</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-1 text-sm text-[#635BFF] hover:text-[#5045e5] mb-4 md:mb-6 font-medium active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Invoices
          </button>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{invoice.invoiceNumber}</h1>
                {getStatusBadge(invoice.status, true)}
              </div>
              <p className="text-sm md:text-base text-gray-600">
                Billed to {invoice.customer?.name || 'Customer'} · ${invoice.total.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  if (invoice.status === 'paid') {
                    toast.error('Cannot edit a paid invoice');
                    return;
                  }
                  navigate(`/invoices/${invoice.id}/edit`);
                }}
                variant="outline"
                size="sm"
                disabled={invoice.status === 'paid'}
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium border-gray-300"
              >
                <Edit2 className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">Edit invoice</span>
              </Button>
              <Button
                onClick={handleSendInvoice}
                disabled={isSending}
                size="sm"
                className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium bg-[#635BFF] hover:bg-[#5045e5] text-white active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">
                  {isSending
                    ? 'Sending...'
                    : invoice.status === 'paid'
                      ? 'Send receipt'
                      : 'Send invoice'}
                </span>
              </Button>
              {invoice.status !== 'paid' && invoice.amountDue > 0 && (
                <Button
                  onClick={() => setIsPaymentDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 md:px-4 text-xs md:text-sm font-medium border-gray-300"
                >
                  <CreditCard className="w-4 h-4 md:mr-1.5" />
                  <span className="hidden md:inline">Record Payment</span>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-gray-300 active:scale-95">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={copyInvoiceLink}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy invoice link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDownloadDialogOpen(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Status Banner - Always visible */}
        <div className="mb-6">
          {(() => {
            console.log('Status Banner Check:', invoice.status);

            switch (invoice.status?.toLowerCase()) {
              case 'paid':
                return (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-green-900">Payment Received</h3>
                        <p className="text-sm text-green-700">This invoice has been fully paid{invoice.paidDate ? ` on ${new Date(invoice.paidDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}.</p>
                      </div>
                    </div>
                  </div>
                );
              case 'overdue':
                return (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-red-900">Payment Overdue</h3>
                        <p className="text-sm text-red-700">
                          {invoice.dueDate
                            ? `This invoice was due on ${new Date(invoice.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}.`
                            : 'This invoice is overdue.'
                          } Outstanding amount: ${invoice.amountDue?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              case 'draft':
                return (
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Draft Invoice</h3>
                        <p className="text-sm text-gray-700">This invoice is still in draft mode. Send it to the customer when ready.</p>
                      </div>
                    </div>
                  </div>
                );
              case 'sent':
              case 'pending':
                return (
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900">Invoice Sent</h3>
                        <p className="text-sm text-blue-700">This invoice has been sent to the customer and is awaiting payment.</p>
                      </div>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Invoice Status: {invoice.status}</h3>
                        <p className="text-sm text-gray-700">Current status of this invoice.</p>
                      </div>
                    </div>
                  </div>
                );
            }
          })()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-4 md:mb-6">Summary</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 mb-6 md:mb-8">
                {/* Billed to */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Billed to</h4>
                  <button
                    onClick={() => {
                      if (invoice.customer?.id) {
                        navigate(`/customers/${invoice.customer.id}`);
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-[#635BFF] hover:text-[#5045e5] mb-2 transition-colors active:scale-95"
                  >
                    <User className="w-4 h-4" />
                    {invoice.customer?.name || 'Customer'}
                  </button>
                  <p className="text-sm text-gray-600">{invoice.customer?.email || '-'}</p>
                </div>

                {/* Invoice number */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Invoice number</h4>
                  <p className="text-sm text-gray-900">{invoice.invoiceNumber}</p>
                </div>

                {/* Billing details */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Billing details</h4>
                  <p className="text-sm text-gray-600">
                    {invoice.customer?.address
                      ? typeof invoice.customer.address === 'string'
                        ? invoice.customer.address
                        : [
                            invoice.customer.address.street,
                            invoice.customer.address.city,
                            invoice.customer.address.state,
                            invoice.customer.address.postalCode,
                            invoice.customer.address.country
                          ].filter(Boolean).join(', ')
                      : 'No address'}
                  </p>
                  {invoice.customer?.phone && <p className="text-sm text-gray-600 mt-1">{invoice.customer.phone}</p>}
                </div>

                {/* Currency */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Currency</h4>
                  <p className="text-sm text-gray-900">{invoice.currency}</p>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Notes</h4>
                  <p className="text-sm text-gray-600">{invoice.notes || '-'}</p>
                </div>

                {/* Payment method */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Payment method</h4>
                  <p className="text-sm text-gray-900">{invoice.paymentMethod || 'Not specified'}</p>
                </div>

                {/* Tax calculation */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Tax calculation</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <span>{invoice.taxRate > 0 ? `${invoice.taxRate}% tax applied` : 'No tax rate applied'}</span>
                    <Info className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border-t border-gray-200 pt-6">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-xs font-semibold text-gray-700">Description</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Qty</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Unit price</th>
                      <th className="pb-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                        <td className="py-3 text-sm text-gray-600 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 text-sm text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                  <div className="w-full sm:w-80 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tax {invoice.taxRate > 0 && `(${invoice.taxRate}%)`}</span>
                      <span className="text-gray-900">{invoice.taxAmount ? `$${invoice.taxAmount.toLocaleString()}` : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${invoice.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-200">
                      <span className="text-gray-600">Amount paid</span>
                      <span className="text-gray-900">${invoice.amountPaid?.toLocaleString() || '0.00'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Amount due</span>
                      <span className="text-gray-900 font-semibold">${invoice.amountDue?.toLocaleString() || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Calculation */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Tax calculation</h3>
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">No tax rate applied.</p>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Info className="w-4 h-4" />
                  <span>Calculate tax automatically on future invoices using definvoice.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Details</h3>
                {invoice.status !== 'paid' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => setIsDetailsDialogOpen(true)}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                  </Button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 mb-2">ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-gray-900 break-all">{invoice.id}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-gray-100 shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(invoice.id);
                        toast.success('Invoice ID copied to clipboard');
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Issue Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {invoice.dueDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Due Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-2">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {invoice.templateStyle && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Template Style</p>
                    <p className="text-sm text-gray-900 capitalize">{invoice.templateStyle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Metadata</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={() => {
                    if (invoice.status === 'paid') {
                      toast.error('Cannot edit metadata for paid invoices');
                      return;
                    }
                    setIsMetadataDialogOpen(true);
                  }}
                  disabled={invoice.status === 'paid'}
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </Button>
              </div>
              {(() => {
                console.log('Metadata check:', {
                  metadata: invoice.metadata,
                  hasMetadata: invoice.metadata && typeof invoice.metadata === 'object',
                  keys: invoice.metadata ? Object.keys(invoice.metadata) : [],
                  length: invoice.metadata ? Object.keys(invoice.metadata).length : 0
                });

                if (invoice.metadata && typeof invoice.metadata === 'object' && Object.keys(invoice.metadata).length > 0) {
                  return (
                    <div className="space-y-3">
                      {Object.entries(invoice.metadata).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-md p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">{key}</p>
                          <p className="text-sm text-gray-900 break-all">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  );
                }
                return <p className="text-sm text-gray-500">No metadata</p>;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        invoiceId={invoice.id}
        invoiceTotal={invoice.total}
        amountDue={invoice.amountDue}
        currency={invoice.currency}
        onSuccess={() => {
          refetch();
          setIsPaymentDialogOpen(false);
        }}
      />

      {/* Edit Details Dialog */}
      <EditDetailsDialog
        open={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        invoiceId={invoice.id}
        currentDueDate={invoice.dueDate}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Edit Metadata Dialog */}
      <EditMetadataDialog
        open={isMetadataDialogOpen}
        onClose={() => setIsMetadataDialogOpen(false)}
        invoiceId={invoice.id}
        currentMetadata={invoice.metadata}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Download Invoice Dialog */}
      <DownloadInvoiceDialog
        open={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        invoice={invoice}
        logo={invoice.organization?.logo}
      />
    </div>
  );
};
