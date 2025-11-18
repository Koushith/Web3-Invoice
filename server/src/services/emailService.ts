import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvoiceEmailParams {
  to: string;
  invoiceNumber: string;
  invoiceAmount: string;
  currency: string;
  dueDate?: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  companyName: string;
  companyEmail?: string;
  companyPhone?: string;
  invoiceUrl: string;
  pdfUrl?: string;
}

export const sendInvoiceEmail = async (params: SendInvoiceEmailParams) => {
  const {
    to,
    invoiceNumber,
    invoiceAmount,
    currency,
    dueDate,
    customerName,
    companyName,
    invoiceUrl,
  } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'invoices@definvoice.com',
      to: [to],
      subject: `Invoice ${invoiceNumber} from ${companyName}`,
      html: generateInvoiceEmailHTML(params),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error: any) {
    console.error('Email service error:', error);
    throw new Error(`Email service failed: ${error.message}`);
  }
};

const generateInvoiceEmailHTML = (params: SendInvoiceEmailParams): string => {
  const {
    invoiceNumber,
    invoiceAmount,
    currency,
    dueDate,
    customerName,
    customerEmail,
    customerCompany,
    companyName,
    companyEmail,
    companyPhone,
    invoiceUrl,
  } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 40px;
    }
    .amount-box {
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .amount-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .amount-value {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #0066ff;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      margin: 24px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 4px 0;
    }
    p {
      margin: 0 0 16px 0;
      font-size: 15px;
      color: #374151;
    }
    strong {
      color: #111827;
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px;
      }
      .footer {
        padding: 20px 24px;
      }
      .amount-value {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p style="margin-bottom: 24px;">Hi ${customerName || 'there'},</p>

      <p>Please find your invoice ${invoiceNumber} from <strong>${companyName}</strong>.</p>

      <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin: 24px 0;">
        <p style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin: 0 0 12px 0; letter-spacing: 0.5px; font-weight: 600;">From</p>
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #111827; font-size: 14px;">${companyName}</p>
        ${companyEmail ? `<p style="margin: 0 0 4px 0; color: #374151; font-size: 14px;">${companyEmail}</p>` : ''}
        ${companyPhone ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${companyPhone}</p>` : ''}
      </div>

      <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin: 24px 0;">
        <div style="display: table; width: 100%;">
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; color: #6b7280; font-size: 13px; width: 40%;">Invoice Number</div>
            <div style="display: table-cell; padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${invoiceNumber}</div>
          </div>
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; color: #6b7280; font-size: 13px;">Amount</div>
            <div style="display: table-cell; padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${currency} ${invoiceAmount}</div>
          </div>
          ${dueDate ? `
          <div style="display: table-row;">
            <div style="display: table-cell; padding: 8px 0; color: #6b7280; font-size: 13px;">Due Date</div>
            <div style="display: table-cell; padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${dueDate}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <p>${dueDate ? `Payment is due by <strong>${dueDate}</strong>.` : 'Please process payment at your earliest convenience.'}</p>

      <div class="amount-box">
        <div class="amount-label">Amount Due</div>
        <p class="amount-value">${currency} ${invoiceAmount}</p>
      </div>

      <p style="margin-bottom: 8px;">You can view and pay your invoice online:</p>

      <div style="margin: 24px 0;">
        <a href="${invoiceUrl}" class="cta-button">View Invoice</a>
      </div>

      <p style="margin-top: 32px; margin-bottom: 8px;">Thank you for your business!</p>
      <p style="margin: 0;"><strong>${companyName}</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated message from ${companyName}</p>
      <p>If you have any questions, please reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
};

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
  userEmail: string;
}

export const sendWelcomeEmail = async (params: SendWelcomeEmailParams) => {
  const { to, userName } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'invoices@definvoice.com',
      to: [to],
      subject: 'Welcome to DefInvoice! 🎉',
      html: generateWelcomeEmailHTML(params),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error: any) {
    console.error('Welcome email service error:', error);
    throw new Error(`Welcome email failed: ${error.message}`);
  }
};

const generateWelcomeEmailHTML = (params: SendWelcomeEmailParams): string => {
  const { userName } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to DefInvoice</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #635bff 0%, #5045e5 100%);
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      margin: 0;
    }
    .content {
      padding: 40px;
    }
    .welcome-message {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid #635bff;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
    }
    .feature-box {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 16px 0;
      border-left: 3px solid #635bff;
    }
    .feature-box h3 {
      color: #111827;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    .feature-box p {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #635bff 0%, #5045e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      box-shadow: 0 4px 6px rgba(99, 91, 255, 0.2);
    }
    .footer {
      background-color: #f9fafb;
      padding: 32px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
    }
    p {
      margin: 0 0 16px 0;
      font-size: 15px;
      color: #374151;
    }
    strong {
      color: #111827;
      font-weight: 600;
    }
    .emoji {
      font-size: 48px;
      margin: 24px 0;
      display: block;
      text-align: center;
    }
    @media only screen and (max-width: 600px) {
      .header {
        padding: 32px 24px;
      }
      .header h1 {
        font-size: 28px;
      }
      .content {
        padding: 24px;
      }
      .footer {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to DefInvoice! 🎉</h1>
      <p>Your journey to effortless invoicing starts here</p>
    </div>

    <div class="content">
      <div class="welcome-message">
        <p style="margin: 0; font-size: 18px; color: #111827; font-weight: 600;">Hi ${userName || 'there'}! 👋</p>
        <p style="margin: 8px 0 0 0; color: #374151;">We're thrilled to have you on board. DefInvoice is designed to make invoicing simple, beautiful, and powerful.</p>
      </div>

      <p>You now have access to everything you need to manage your invoices professionally:</p>

      <div class="feature-box">
        <h3>📄 Beautiful Invoice Templates</h3>
        <p>Choose from 12 professionally designed templates that make your invoices stand out</p>
      </div>

      <div class="feature-box">
        <h3>👥 Customer Management</h3>
        <p>Keep track of all your customers and their payment history in one place</p>
      </div>

      <div class="feature-box">
        <h3>💰 Payment Tracking</h3>
        <p>Record payments easily and see real-time financial insights on your dashboard</p>
      </div>

      <div class="feature-box">
        <h3>🔗 Shareable Links</h3>
        <p>Send professional public invoice links to your customers instantly</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/invoices/new" class="cta-button">Create Your First Invoice</a>
      </div>

      <p style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        💡 <strong style="color: #374151;">Pro Tip:</strong> Start by adding a few customers, then create your first invoice. You can customize everything from templates to payment methods!
      </p>

      <p style="margin-top: 24px; color: #374151;">
        If you have any questions or need help getting started, just reply to this email. We're here to help!
      </p>

      <p style="margin-top: 24px;">
        Happy invoicing! 🚀<br>
        <strong>The DefInvoice Team</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>DefInvoice</strong></p>
      <p>Modern invoicing made simple</p>
      <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export default {
  sendInvoiceEmail,
  sendWelcomeEmail,
};
