# Seed Data Script

This script populates your database with mock data for testing the DefInvoice application.

## What Gets Created

### Customers (12)
- Acme Corporation
- Tech Solutions Inc
- Global Industries
- Innovate LLC
- Future Tech Co
- Creative Studios
- Enterprise Solutions
- Digital Marketing Pro
- CloudSoft Systems
- Retail Connect
- HealthTech Innovations
- Finance Advisors Group

Each customer includes:
- Name, email, phone
- Full address
- Tax ID
- Website
- Creation dates spread over the last 6 months

### Invoices (40)
Invoices with various statuses:
- **Paid invoices** (~40%) - Fully paid with payment records
- **Sent invoices** (~15%) - Awaiting payment
- **Viewed invoices** (~15%) - Customer has viewed
- **Partial invoices** (~15%) - Partially paid with payment records
- **Overdue invoices** (~10%) - Past due date
- **Draft invoices** (~5%) - Not yet sent

Each invoice includes:
- 2 random line items (services/products)
- Subtotal, tax (8%), and total calculations
- Random amounts between $500 - $5,000
- 30-day payment terms
- Creation dates spread over the last 4 months

### Payments
- Full payment records for all "paid" invoices
- Partial payment records for "partial" invoices
- Various payment methods: bank transfer, cash, check, card
- Transaction references
- Realistic payment dates

## How to Run

### Prerequisites
1. Make sure MongoDB is running
2. Make sure you have at least one user account created (sign up via the app)
3. Navigate to the server directory

### Run the Script

```bash
cd server
npm run seed
```

Or using the full command:

```bash
tsx src/scripts/seedData.ts
```

## What the Script Does

1. ✅ Connects to MongoDB
2. ✅ Finds your user and organization
3. ✅ Creates 12 diverse customers
4. ✅ Creates 40 invoices with various statuses
5. ✅ Creates payment records for paid/partial invoices
6. ✅ Uses realistic dates (spread over last 6 months)
7. ✅ Randomizes amounts, services, and payment methods

## Output

You'll see progress messages like:
```
Connected to MongoDB
Using organization: My Business (64abc123...)
Creating customers...
✓ Created customer: Acme Corporation
✓ Created customer: Tech Solutions Inc
...
Creating invoices...
✓ Created invoice: INV-1000 - paid - $2,450.00
✓ Created invoice: INV-1001 - sent - $1,230.50
...
✅ Database seeded successfully!
   - 12 customers created
   - 40 invoices created with various statuses
   - Payment records created for paid/partial invoices
```

## Clearing Data

If you want to clear existing test data before seeding, uncomment these lines in `seedData.ts`:

```typescript
// Uncomment to clear existing data:
await Customer.deleteMany({ organizationId: organization._id });
await Invoice.deleteMany({ organizationId: organization._id });
await Payment.deleteMany({ organizationId: organization._id });
```

## Testing the Dashboard

After running the seed script, you can test:

### Dashboard Metrics
- ✅ Total revenue calculation
- ✅ Invoice counts by status
- ✅ Outstanding amounts
- ✅ Customer count
- ✅ Average invoice value

### Charts
- ✅ Revenue trends
- ✅ Customer growth over months
- ✅ Top customers by revenue
- ✅ Invoice status distribution

### Pages
- ✅ Invoices list with filters
- ✅ Customers list
- ✅ Payments/transactions list
- ✅ Customer detail pages with history
- ✅ Invoice detail pages

## Customization

You can modify the script to:
- Change the number of customers (edit `mockCustomers` array)
- Change the number of invoices (edit loop count in line ~150)
- Adjust status distribution (edit `statuses` array)
- Change date ranges (edit `randomDateInPast` calls)
- Modify amount ranges (edit `randomAmount` parameters)

## Troubleshooting

**Error: No user found**
- Make sure you've signed up and have at least one user account
- Check your MongoDB connection

**Error: No organization found**
- Your user needs to be linked to an organization
- Sign up through the app first

**Connection errors**
- Check `MONGODB_URI` in your `.env` file
- Make sure MongoDB is running: `brew services start mongodb-community`

## Notes

- The script uses the first user it finds
- All data is linked to that user's organization
- Customer creation dates are randomized over the last 6 months
- Invoice creation dates are randomized over the last 4 months
- Payment dates are realistic (within days of invoice creation)
- Amounts are randomized to create diverse scenarios
