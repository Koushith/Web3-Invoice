# Quick Start Guide - DefInvoice

**Coming back to this project after a break?** Use this guide to get up and running quickly.

---

## 📊 Current Status

✅ **Backend:** 95% Complete (Express + MongoDB + Request Network)
✅ **Frontend:** UI Complete (needs API integration)
⏳ **Integration:** Needs work
⏳ **Deployment:** Not started

**Last worked on:** Request Network integration

---

## 🚀 To Start Coding Again

### 1. Quick Setup (5 minutes)

```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your credentials (see below)

# Frontend
cd ../client
npm install
```

### 2. Required Credentials

**MongoDB:**
- Local: `mongodb://localhost:27017/definvoice`
- Or use [MongoDB Atlas](https://mongodb.com/cloud/atlas) (free tier)

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings > Service Accounts > Generate Private Key
3. Copy credentials to `server/.env`

**Wallet (for crypto payments):**
- Use [MetaMask](https://metamask.io/) to create a wallet
- Or generate one at [Vanity ETH](https://vanity-eth.tk/)
- Copy address and private key to `server/.env`

### 3. Start Development

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Should see: "✅ MongoDB connected" and "🚀 Server running on port 5000"

# Terminal 2 - Frontend
cd client
npm run dev
# Opens at http://localhost:5173
```

### 4. Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# API info
curl http://localhost:5000/api/v1
```

---

## 📝 What to Work On Next

Read `PROGRESS.md` for full details. Here's the quick version:

### Option A: Complete Payment Integration (Recommended)
**Goal:** Make crypto payments work end-to-end

1. **Add payment link endpoint** (`server/src/controllers/invoiceController.ts`)
   ```typescript
   // Add this function:
   export const getPaymentLink = asyncHandler(async (req, res) => {
     const invoice = await Invoice.findById(req.params.id);
     if (!invoice.requestNetworkId) {
       throw new AppError('No payment request created');
     }
     const link = generatePaymentLink(invoice.requestNetworkId);
     res.json({ paymentLink: link });
   });
   ```

2. **Create payment sync job** (`server/src/jobs/paymentSync.ts`)
   - Background job to check Request Network for payments
   - Update MongoDB when payments are detected
   - Run every 30 seconds or via webhook

3. **Test it:**
   - Create an invoice
   - Generate payment link
   - Pay via Request Network
   - Verify payment shows in MongoDB

### Option B: Frontend Integration
**Goal:** Connect React app to backend

1. **Install dependencies:**
   ```bash
   cd client
   npm install firebase axios @tanstack/react-query
   ```

2. **Create API service** (`client/src/services/api.ts`)
3. **Add authentication** (`client/src/contexts/AuthContext.tsx`)
4. **Replace mock data** in existing screens
5. **Add forms** for creating invoices/customers

### Option C: Deploy Now
**Goal:** Get it live quickly

```bash
# Backend to Railway
railway login
railway init
railway add mongodb
railway up

# Frontend to Vercel
vercel deploy
```

---

## 📂 Key Files

**Backend:**
- `server/src/index.ts` - Main entry point
- `server/src/models/*.ts` - Database schemas
- `server/src/controllers/*.ts` - API logic
- `server/src/routes/*.ts` - API routes
- `server/src/services/requestNetworkService.ts` - Crypto payment logic

**Frontend:**
- `client/src/App.tsx` - Routes
- `client/src/screens/home/Home.tsx` - Dashboard
- `client/src/screens/invoice/Invoice.tsx` - Invoice list
- `client/src/screens/customer/Customer.tsx` - Customer list
- `client/src/components/layout/AppShell.tsx` - Main layout

---

## 🐛 Common Issues

### "Cannot connect to MongoDB"
```bash
# Start MongoDB locally
brew services start mongodb-community
# Or use MongoDB Atlas cloud connection string
```

### "Firebase error: Invalid credentials"
- Check `FIREBASE_PRIVATE_KEY` has proper newlines: `\\n`
- Verify project ID matches Firebase console
- Ensure service account has proper permissions

### "Request Network: Node version warning"
- Warning is safe to ignore
- Or upgrade Node.js to v22+: `nvm install 22`

### "Port 5000 already in use"
- Change `PORT=5001` in `server/.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

---

## 🎯 30-Minute Quick Win Tasks

**Pick one and complete it:**

1. **Test the backend APIs** (Use Postman/Insomnia)
   - Register a user
   - Create a customer
   - Create an invoice
   - Record a payment

2. **Create login screen** (Frontend)
   - Install Firebase SDK
   - Create simple login form
   - Store auth token

3. **Connect one page** (Frontend)
   - Connect dashboard to `/api/v1/dashboard/stats`
   - Replace mock data with real data
   - Add loading state

4. **Set up MongoDB** (Infrastructure)
   - Create MongoDB Atlas account
   - Create cluster
   - Get connection string
   - Test connection

---

## 📚 Documentation

- **Full Progress:** `PROGRESS.md`
- **Backend Setup:** `server/README.md`
- **API Endpoints:** See `server/README.md` or run `http://localhost:5000/api/v1`
- **Request Network:** [docs.request.network](https://docs.request.network/)

---

## 💬 Questions?

1. Check `PROGRESS.md` for comprehensive details
2. Review `server/README.md` for backend specifics
3. Look at existing code in `server/src/` and `client/src/`
4. Read inline comments in controllers

---

## ✅ Before You Stop Working

**Save your progress:**

1. Update `PROGRESS.md` with what you completed
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Your progress description"
   git push
   ```
3. Note any blockers or next steps at the top of `PROGRESS.md`

---

**Ready to continue?** Pick a task from "What to Work On Next" and go! 🚀
