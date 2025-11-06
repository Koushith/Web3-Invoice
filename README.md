# DefInvoice - Full-Stack Invoice Management System

> A complete E2E SaaS platform for invoice management with crypto payment support via Request Network. Users experience it as a normal Web2 app - no blockchain knowledge required.

---

## 🎯 Project Vision

**DefInvoice** makes invoicing simple for everyone:
- **Web2 users:** Traditional invoice management, familiar UX
- **Web3 users:** Optional crypto payments via Request Network
- **No blockchain jargon:** "Pay with Crypto" is just another payment method

**Key Differentiator:** ALL data stored in YOUR MongoDB database. Request Network is just a payment rail, not your database.

---

## ✨ Features

### Core Features (Built ✅)
- 📄 Full invoice lifecycle (draft → sent → paid → overdue)
- 👥 Customer management with wallet addresses
- 💰 Payment tracking (crypto + manual)
- 📊 Dashboard with analytics and charts
- 🏢 Multi-tenant organizations
- 🔐 Firebase authentication
- 💱 Multi-currency support
- 🔢 Auto invoice numbering

### Crypto Payments (Request Network)
- Create payment requests on-chain
- Accept ETH, USDC, USDT, DAI
- Payment detection and reconciliation
- QR code payment links
- All data stored in MongoDB (not relying on blockchain queries)

---

## 🏗️ Architecture

### Backend (Express.js + MongoDB)
```
API → Firebase Auth → Controllers → MongoDB
                    → Request Network (payment rail)
```

### Data Flow
```
1. User creates invoice → Stored in MongoDB
2. Invoice generates payment request → Request Network (optional)
3. Request Network ID stored → MongoDB
4. Customer pays crypto → Blockchain
5. Payment detected → Stored in MongoDB
6. Invoice updated → MongoDB
```

**MongoDB = Single source of truth**

---

## 📁 Project Structure

```
invoice-app/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database, Firebase, Request Network setup
│   │   ├── controllers/   # API business logic
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Mongoose schemas (User, Invoice, Payment, etc.)
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Request Network integration
│   │   └── index.ts       # App entry point
│   └── package.json
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── screens/       # Pages (Home, Invoices, Customers)
│   │   ├── components/    # UI components (shadcn/ui)
│   │   └── App.tsx
│   └── package.json
│
├── PROGRESS.md            # Detailed development progress
├── QUICKSTART.md          # Quick setup guide
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (22+ recommended for Request Network)
- MongoDB (local or Atlas)
- Firebase account
- Ethereum wallet (for receiving crypto payments)

### Setup (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo>
cd invoice-app

# 2. Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your credentials

# 3. Frontend setup
cd ../client
npm install

# 4. Start development
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### Configuration

Edit `server/.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/definvoice
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
ORG_WALLET_ADDRESS=0x...
ORG_WALLET_PRIVATE_KEY=0x...
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### Authentication
- POST `/auth/register` - Register new user
- GET `/auth/profile` - Get user profile
- POST `/auth/organization` - Create organization

### Invoices
- GET `/invoices` - List invoices (with filters)
- POST `/invoices` - Create invoice
- GET `/invoices/:id` - Get invoice
- PUT `/invoices/:id` - Update invoice
- PATCH `/invoices/:id/status` - Update status

### Customers
- GET `/customers` - List customers
- POST `/customers` - Create customer
- PUT `/customers/:id` - Update customer

### Payments
- GET `/payments` - List payments
- POST `/payments` - Record payment
- GET `/payments/invoice/:id` - Get invoice payments

### Dashboard
- GET `/dashboard/stats` - Get metrics
- GET `/dashboard/revenue` - Revenue data
- GET `/dashboard/activity` - Activity feed

**Authentication:** All protected endpoints require Firebase JWT token in `Authorization: Bearer <token>` header.

---

## 🗄️ Database Schema

### User
```javascript
{
  firebaseUid: String,
  email: String,
  organizationId: ObjectId,
  role: 'owner' | 'admin' | 'accountant' | 'viewer'
}
```

### Invoice
```javascript
{
  invoiceNumber: String,  // Auto-generated
  customerId: ObjectId,
  status: 'draft' | 'sent' | 'paid' | 'overdue',
  lineItems: [{ description, quantity, unitPrice, amount }],
  total: Number,
  amountPaid: Number,
  amountDue: Number,
  requestNetworkId: String,  // Request Network reference
  // ... timestamps, dates, etc.
}
```

### Payment
```javascript
{
  invoiceId: ObjectId,
  amount: Number,
  paymentMethod: 'crypto' | 'cash' | 'bank_transfer',
  paymentReference: {
    request_network_id: String,
    blockchain_tx_hash: String,
    blockchain_network: String
  },
  status: 'completed' | 'pending'
}
```

---

## 🔐 Security

- ✅ Firebase JWT authentication
- ✅ Organization-scoped data (multi-tenancy)
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling
- ✅ Private keys never exposed to frontend
- ✅ CORS configured

---

## 🎨 Tech Stack

### Backend
- **Framework:** Express.js + TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** Firebase Admin SDK
- **Crypto:** Request Network + Ethers.js
- **Validation:** Custom middleware

### Frontend
- **Framework:** React 18 + Vite
- **UI:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

---

## 📋 What's Next

See `PROGRESS.md` for detailed next steps. Quick version:

### Immediate (1-2 hours)
1. Complete Request Network payment creation
2. Add payment status polling
3. Test crypto payment flow

### Short-term (1 day)
1. Frontend authentication (Firebase SDK)
2. Replace mock data with API calls
3. Create invoice/customer forms

### Medium-term (1 week)
1. PDF invoice generation
2. Email notifications
3. Recurring invoices
4. Deploy to production

---

## 🚢 Deployment

### Backend (Railway)
```bash
railway login
railway init
railway add mongodb
railway up
```

### Frontend (Vercel)
```bash
vercel login
vercel deploy
```

---

## 📚 Documentation

- **Quick Start:** `QUICKSTART.md` - Get running in 5 minutes
- **Progress Tracking:** `PROGRESS.md` - Detailed status and next steps
- **Backend Details:** `server/README.md` - API docs and setup
- **Request Network:** [docs.request.network](https://docs.request.network/)

---

## 💡 Key Design Decisions

### Why MongoDB for everything?
- Fast queries (no blockchain waiting)
- Easy reporting and analytics
- Standard backup and recovery
- SQL-like queries when needed
- Full control over your data

### Why Request Network?
- Open protocol (not vendor lock-in)
- Multi-chain support (20+ blockchains)
- Low fees (~$0.10 per invoice)
- Automatic payment detection
- No smart contract deployment needed

### Why Firebase Auth?
- Easy setup
- Good developer experience
- Free tier generous
- Mobile SDK available
- Can switch to custom auth later

---

## 🐛 Troubleshooting

**MongoDB connection failed:**
```bash
brew services start mongodb-community
# Or use MongoDB Atlas connection string
```

**Request Network Node version warning:**
- Safe to ignore or upgrade to Node 22+

**Firebase auth error:**
- Check private key has `\\n` for newlines
- Verify project ID matches Firebase console

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill
```

---

## 📄 License

MIT

---

## 🤝 Contributing

This is a personal/side project. Feel free to fork and modify for your needs.

---

**Questions?** Check `PROGRESS.md` for details or `QUICKSTART.md` to start coding.
