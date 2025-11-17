import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Customer, Invoice, Payment, Organization, User } from '../models';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/definvoice';

// Sample customer data
const mockCustomers = [
  {
    name: 'Acme Corporation',
    email: 'contact@acmecorp.com',
    phone: '+1-555-0101',
    address: '123 Business St, San Francisco, CA 94102',
    taxId: 'TAX-001',
    website: 'https://acmecorp.com',
  },
  {
    name: 'Tech Solutions Inc',
    email: 'info@techsolutions.com',
    phone: '+1-555-0102',
    address: '456 Innovation Ave, Austin, TX 78701',
    taxId: 'TAX-002',
    website: 'https://techsolutions.com',
  },
  {
    name: 'Global Industries',
    email: 'sales@globalind.com',
    phone: '+1-555-0103',
    address: '789 Enterprise Blvd, New York, NY 10001',
    taxId: 'TAX-003',
    website: 'https://globalind.com',
  },
  {
    name: 'Innovate LLC',
    email: 'hello@innovatellc.com',
    phone: '+1-555-0104',
    address: '321 Startup Lane, Seattle, WA 98101',
    taxId: 'TAX-004',
    website: 'https://innovatellc.com',
  },
  {
    name: 'Future Tech Co',
    email: 'contact@futuretech.io',
    phone: '+1-555-0105',
    address: '654 Digital Dr, Boston, MA 02101',
    taxId: 'TAX-005',
    website: 'https://futuretech.io',
  },
  {
    name: 'Creative Studios',
    email: 'projects@creativestudios.com',
    phone: '+1-555-0106',
    address: '987 Design Way, Los Angeles, CA 90001',
    taxId: 'TAX-006',
    website: 'https://creativestudios.com',
  },
  {
    name: 'Enterprise Solutions',
    email: 'admin@enterprisesol.com',
    phone: '+1-555-0107',
    address: '147 Corporate Plaza, Chicago, IL 60601',
    taxId: 'TAX-007',
    website: 'https://enterprisesol.com',
  },
  {
    name: 'Digital Marketing Pro',
    email: 'team@digitalmktpro.com',
    phone: '+1-555-0108',
    address: '258 Media Circle, Miami, FL 33101',
    taxId: 'TAX-008',
    website: 'https://digitalmktpro.com',
  },
  {
    name: 'CloudSoft Systems',
    email: 'support@cloudsoft.com',
    phone: '+1-555-0109',
    address: '369 Cloud Ave, Denver, CO 80201',
    taxId: 'TAX-009',
    website: 'https://cloudsoft.com',
  },
  {
    name: 'Retail Connect',
    email: 'info@retailconnect.com',
    phone: '+1-555-0110',
    address: '741 Commerce St, Portland, OR 97201',
    taxId: 'TAX-010',
    website: 'https://retailconnect.com',
  },
  {
    name: 'HealthTech Innovations',
    email: 'contact@healthtechinno.com',
    phone: '+1-555-0111',
    address: '852 Medical Pkwy, Atlanta, GA 30301',
    taxId: 'TAX-011',
    website: 'https://healthtechinno.com',
  },
  {
    name: 'Finance Advisors Group',
    email: 'advisory@financeadv.com',
    phone: '+1-555-0112',
    address: '963 Wall Street, New York, NY 10005',
    taxId: 'TAX-012',
    website: 'https://financeadv.com',
  },
];

// Generate random date in the past X months
const randomDateInPast = (monthsAgo: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsAgo));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date;
};

// Generate random amount
const randomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the first user and organization (you need to have at least one user)
    const user = await User.findOne();
    if (!user) {
      console.error('No user found. Please create a user first by signing up.');
      process.exit(1);
    }

    const organization = await Organization.findOne({ _id: user.organizationId });
    if (!organization) {
      console.error('No organization found.');
      process.exit(1);
    }

    console.log(`Using organization: ${organization.name} (${organization._id})`);

    // Clear existing mock data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing test data...');
    await Customer.deleteMany({ organizationId: organization._id });
    await Invoice.deleteMany({ organizationId: organization._id });
    await Payment.deleteMany({ organizationId: organization._id });

    // Create customers
    console.log('Creating customers...');
    const customers = [];
    for (const customerData of mockCustomers) {
      const customer = await Customer.create({
        ...customerData,
        organizationId: organization._id,
        createdAt: randomDateInPast(6), // Created within last 6 months
      });
      customers.push(customer);
      console.log(`✓ Created customer: ${customer.name}`);
    }

    // Create invoices with various statuses
    console.log('\nCreating invoices...');
    const statuses = ['paid', 'paid', 'paid', 'sent', 'viewed', 'partial', 'overdue', 'draft'];
    let invoiceCounter = 1000;

    for (let i = 0; i < 40; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdDate = randomDateInPast(4);

      const items = [
        {
          description: ['Web Development Services', 'Consulting Services', 'Design Work', 'API Integration', 'Database Setup'][Math.floor(Math.random() * 5)],
          quantity: Math.floor(Math.random() * 10) + 1,
          unitPrice: randomAmount(50, 500),
        },
        {
          description: ['Technical Support', 'Maintenance', 'Training', 'Documentation', 'Testing'][Math.floor(Math.random() * 5)],
          quantity: Math.floor(Math.random() * 5) + 1,
          unitPrice: randomAmount(30, 300),
        },
      ];

      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const taxRate = 0.08; // 8% tax
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;

      let amountPaid = 0;
      let paidAt = null;

      if (status === 'paid') {
        amountPaid = total;
        paidAt = new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // Paid within 7 days
      } else if (status === 'partial') {
        amountPaid = total * (Math.random() * 0.5 + 0.3); // 30-80% paid
      }

      const dueDate = new Date(createdDate);
      dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

      const invoice = await Invoice.create({
        organizationId: organization._id,
        customerId: customer._id,
        createdBy: user._id,
        invoiceNumber: `INV-${String(invoiceCounter++).padStart(4, '0')}`,
        status,
        items,
        subtotal,
        taxAmount,
        total,
        amountPaid,
        amountDue: total - amountPaid,
        dueDate,
        paidAt,
        currency: 'USD',
        notes: 'Thank you for your business!',
        terms: 'Net 30',
        createdAt: createdDate,
        updatedAt: status === 'paid' ? paidAt : createdDate,
      });

      // Create payment record for paid invoices
      if (status === 'paid' && paidAt) {
        await Payment.create({
          organizationId: organization._id,
          invoiceId: invoice._id,
          customerId: customer._id,
          amount: total,
          currency: 'USD',
          paymentMethod: ['bank_transfer', 'cash', 'check', 'stripe'][Math.floor(Math.random() * 4)],
          status: 'completed',
          transactionReference: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
          notes: 'Payment received',
          createdAt: paidAt,
        });
      }

      // Create payment records for partial payments
      if (status === 'partial') {
        await Payment.create({
          organizationId: organization._id,
          invoiceId: invoice._id,
          customerId: customer._id,
          amount: amountPaid,
          currency: 'USD',
          paymentMethod: ['bank_transfer', 'cash', 'check'][Math.floor(Math.random() * 3)],
          status: 'completed',
          transactionReference: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
          notes: 'Partial payment received',
          createdAt: new Date(createdDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
        });
      }

      console.log(`✓ Created invoice: ${invoice.invoiceNumber} - ${status} - $${total.toFixed(2)}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`   - ${customers.length} customers created`);
    console.log(`   - 40 invoices created with various statuses`);
    console.log(`   - Payment records created for paid/partial invoices`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
