# DefInvoice Backend API

Invoice management backend built with Express.js, TypeScript, MongoDB, and Firebase Authentication.

## Features

- 🔐 Firebase Authentication
- 📄 Invoice Management (CRUD, Status Tracking)
- 👥 Customer Management
- 💳 Payment Processing (Stripe + Crypto via Request Network)
- 📊 Dashboard Analytics
- 🔄 Multi-currency Support
- 📱 RESTful API

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase Admin SDK
- **Payments:** Stripe

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase private key
- `STRIPE_SECRET_KEY` - Stripe API secret key

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb-community
brew services start mongodb-community

# Connection string:
MONGODB_URI=mongodb://localhost:27017/definvoice
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to `.env`

**Option C: Railway MongoDB**
```bash
# Add MongoDB to your Railway project
railway add mongodb

# Get connection string from Railway dashboard
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Go to Project Settings > Service Accounts
4. Generate new private key
5. Copy credentials to `.env`:
   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### 5. Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
- `POST /auth/register` - Register user after Firebase signup
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update profile (protected)
- `POST /auth/organization` - Create organization (protected)

### Customers
- `GET /customers` - List customers (protected)
- `GET /customers/:id` - Get customer (protected)
- `POST /customers` - Create customer (protected)
- `PUT /customers/:id` - Update customer (protected)
- `DELETE /customers/:id` - Delete customer (protected)

### Invoices
- `GET /invoices` - List invoices (protected)
- `GET /invoices/:id` - Get invoice (protected)
- `POST /invoices` - Create invoice (protected)
- `PUT /invoices/:id` - Update invoice (protected)
- `DELETE /invoices/:id` - Cancel invoice (protected)
- `PATCH /invoices/:id/status` - Update status (protected)

### Payments
- `GET /payments` - List payments (protected)
- `GET /payments/:id` - Get payment (protected)
- `POST /payments` - Record payment (protected)
- `GET /payments/invoice/:invoiceId` - Get invoice payments (protected)

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics (protected)
- `GET /dashboard/revenue` - Get revenue data (protected)
- `GET /dashboard/activity` - Get activity feed (protected)

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   └── firebase.ts   # Firebase Admin setup
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── index.ts         # App entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
├── tsconfig.json        # TypeScript config
└── package.json
```

## Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Add MongoDB:
```bash
railway add mongodb
```

5. Set environment variables in Railway dashboard

6. Deploy:
```bash
railway up
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production server

## License

MIT
