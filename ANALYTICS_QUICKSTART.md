# Analytics - Quick Start

## 🚀 5-Minute Setup

### Step 1: Get Google Analytics ID
1. Go to **[analytics.google.com](https://analytics.google.com/)**
2. Create account → Add property → Select "Web"
3. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)

### Step 2: Add to Your App
```bash
# Add to client/.env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Deploy
```bash
npm run build
# Deploy to your hosting
```

### Step 4: View Analytics (24-48 hours later)
Go to **[analytics.google.com](https://analytics.google.com/)** → Your Property

---

## 📊 Where to View Analytics

### Real-Time Data (Available immediately)
**Google Analytics** → **Reports** → **Realtime**
- See users browsing right now
- Pages they're viewing
- Events they're triggering

### Key Reports (After 24-48 hours)

#### 1. **User Behavior**
**Reports** → **Engagement** → **Events**
- `invoice_created` - Track invoice creation
- `customer_created` - New customer additions
- `user_logged_in` - Login activity

#### 2. **Popular Pages**
**Reports** → **Engagement** → **Pages and screens**
- Most visited pages
- Time spent per page
- Bounce rates

#### 3. **User Growth**
**Reports** → **Life cycle** → **Acquisition** → **Overview**
- New vs returning users
- User growth trends
- Sign-up sources

#### 4. **Custom Reports**
**Explore** → **Free form**
- Build custom dashboards
- User funnels (Sign-up → Invoice → Payment)
- Cohort analysis

---

## 🔍 What Gets Tracked Automatically

### Page Views
Every page visit is tracked:
- `/invoices` - Invoice list page
- `/customers` - Customer list page
- `/invoices/new` - Create invoice page
- etc.

### User Events
Key business actions:
```
✓ User signed up
✓ User logged in
✓ Invoice created ($1,500 USD)
✓ Customer added
✓ Invoice downloaded (PDF)
✓ Business profile updated
```

### User Identification
When users log in, they're identified by:
- Firebase UID (anonymized)
- Email (optional)
- Organization ID

---

## 💡 During Development

Analytics logs to console instead of sending data:
```javascript
[Analytics] Event: invoice_created { invoiceId: '123', amount: 1500, currency: 'USD' }
[Analytics] Page View: /invoices
[Analytics] Identify: user_uid { email: 'user@example.com' }
```

Open browser DevTools → Console to see events firing.

---

## 📈 Quick Metrics Dashboard

### For Daily Monitoring
- **Active Users**: Reports → Realtime
- **New Invoices**: Reports → Engagement → Events → `invoice_created`
- **Revenue Tracking**: Custom report (sum of `amount` property)

### For Weekly Review
- **User Growth**: Week-over-week comparison
- **Feature Usage**: Top events
- **Page Performance**: Slowest loading pages

### For Monthly Analysis
- **Cohort Retention**: User retention over time
- **Conversion Funnel**: Sign-up → First Invoice → Paid
- **Revenue Trends**: Monthly recurring invoices

---

## 🎯 Most Useful Metrics

### For Founders
1. **Sign-ups per day/week**
   - Reports → Acquisition → User acquisition
2. **Invoice Volume**
   - Reports → Events → `invoice_created`
3. **Active Users (DAU/MAU)**
   - Reports → Engagement → Overview

### For Product Teams
1. **Feature Adoption**
   - Events → Filter by event name
2. **User Flow**
   - Explore → Path exploration
3. **Drop-off Points**
   - Explore → Funnel exploration

---

## ⚡ Pro Tips

1. **Set up Goals**: Define conversions (e.g., "First invoice sent")
2. **Create Segments**: Compare power users vs casual users
3. **Set Alerts**: Get notified of traffic spikes/drops
4. **Export Data**: Download CSVs for deeper analysis
5. **Use Real-time**: Test events immediately after deployment

---

## 🔥 Troubleshooting

### Not seeing data?
1. Check `.env` has correct `VITE_GA_MEASUREMENT_ID`
2. Deployed to production? (Analytics disabled in dev)
3. Wait 24-48 hours for data to appear in reports
4. Check Realtime view for immediate data

### Events not firing?
1. Open browser DevTools → Console
2. Look for `[Analytics]` logs
3. Check if `window.gtag` exists in production

### Need help?
- Check `ANALYTICS_SETUP.md` for detailed guide
- View GA4 documentation
- Test in development mode (events log to console)

---

**Ready to track?** Just add your GA Measurement ID to `.env` and deploy! 🚀
