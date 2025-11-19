# How to View Your Analytics 📊

## TL;DR
Add `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to your `.env`, deploy, and view analytics at **[analytics.google.com](https://analytics.google.com/)**

---

## Complete Viewing Guide

### Option 1: Google Analytics (Recommended - FREE) ✅

**Why?** Most popular, free forever, powerful insights

#### Setup (5 minutes):
```bash
# 1. Get your tracking ID from analytics.google.com
# 2. Add to client/.env:
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 3. Rebuild and deploy
npm run build
```

#### Where to View:
🌐 **[analytics.google.com](https://analytics.google.com/)** → Select your property

**Main Dashboards:**

```
📊 Reports
├── Realtime (Live users)
├── Life cycle
│   ├── Acquisition (New users)
│   └── Engagement
│       ├── Events (invoice_created, customer_created, etc.)
│       └── Pages (Most viewed pages)
└── User
    ├── Demographics
    └── Technology (Devices, browsers)

🔍 Explore (Custom reports)
├── Free form
├── Funnel exploration (Sign-up → Invoice → Payment)
└── Path exploration (User journey)
```

**What You'll See:**
- **Real-time**: Users online right now
- **Page views**: `/invoices`, `/customers`, etc.
- **Events**: `invoice_created`, `customer_added`
- **User info**: Location, device, browser
- **Trends**: Daily/weekly/monthly growth

**Screenshots Location:**
- Dashboard: Home → Overview
- Events: Reports → Engagement → Events
- Pages: Reports → Engagement → Pages and screens
- Real-time: Reports → Realtime

---

### Option 2: Mixpanel (Advanced - Free tier available)

**Why?** Better for user cohorts, A/B testing, retention

#### Setup:
```bash
# 1. Sign up at mixpanel.com
# 2. Get project token
# 3. Add to client/.env:
VITE_MIXPANEL_TOKEN=your_token_here

# 4. Uncomment Mixpanel code in:
# client/src/lib/analytics.ts (lines 56-59, 97-99, 120-125)
```

#### Where to View:
🌐 **[mixpanel.com](https://mixpanel.com/)** → Your project

**Main Features:**
- **Insights**: Event trends over time
- **Funnels**: Conversion tracking (Sign-up → Paid)
- **Retention**: User retention curves
- **Cohorts**: Group users by behavior
- **Flows**: Visual user journey

---

### Option 3: Internal Dashboard (Custom)

**Why?** Complete control, privacy, custom metrics

#### Build Your Own:
Create `/admin/analytics` page with MongoDB aggregations:

```typescript
// Example: Invoice stats
const invoiceStats = await Invoice.aggregate([
  { $match: { organizationId: orgId } },
  { $group: {
    _id: {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' }
    },
    totalInvoices: { $sum: 1 },
    totalRevenue: { $sum: '$total' }
  }},
  { $sort: { '_id.year': -1, '_id.month': -1 } }
]);
```

**What to Track:**
- Total invoices (today/week/month)
- Revenue metrics
- Customer growth
- Payment success rate
- Most active users
- Popular features

**Display With:**
- Charts: [Recharts](https://recharts.org/)
- Tables: TanStack Table
- Stats cards: Tailwind components

---

## 📋 Analytics Access Summary

| Service | URL | Setup Time | Best For |
|---------|-----|------------|----------|
| **Google Analytics** | [analytics.google.com](https://analytics.google.com/) | 5 min | General metrics, page views |
| **Mixpanel** | [mixpanel.com](https://mixpanel.com/) | 10 min | User behavior, cohorts |
| **Console (Dev)** | Browser DevTools | 0 min | Development testing |
| **Custom Dashboard** | Your app `/admin` | 2-4 hours | Custom internal metrics |

---

## 🎯 Quick Access Links

### After Setup, Bookmark These:

**Google Analytics:**
- Dashboard: https://analytics.google.com/analytics/web/#/p{PROPERTY_ID}/reports/dashboard
- Real-time: https://analytics.google.com/analytics/web/#/p{PROPERTY_ID}/reports/realtime
- Events: https://analytics.google.com/analytics/web/#/p{PROPERTY_ID}/reports/explorer

**Mixpanel:**
- Dashboard: https://mixpanel.com/project/{PROJECT_ID}
- Insights: https://mixpanel.com/project/{PROJECT_ID}/view/{VIEW_ID}/app/insights
- Funnels: https://mixpanel.com/project/{PROJECT_ID}/view/{VIEW_ID}/app/funnels

---

## 📱 Mobile Apps

View analytics on the go:

- **Google Analytics App**: [iOS](https://apps.apple.com/app/google-analytics/id881599038) | [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.giant)
- **Mixpanel App**: [iOS](https://apps.apple.com/app/mixpanel/id593253651) | [Android](https://play.google.com/store/apps/details?id=com.mixpanel.android)

---

## 🔍 Example Queries

### Google Analytics 4

**See invoice creation rate:**
1. Go to Reports → Engagement → Events
2. Find `invoice_created` event
3. View count, amount property sum

**Track user conversion:**
1. Go to Explore → Funnel exploration
2. Add steps: `user_signed_up` → `invoice_created` → `invoice_downloaded`
3. View drop-off rates

### Mixpanel

**User retention:**
1. Go to Retention
2. Set "First Action" as `user_signed_up`
3. Set "Return Action" as any event
4. View 7-day, 30-day retention

**Revenue cohorts:**
1. Go to Insights
2. Select `invoice_created` event
3. Group by month
4. Sum `amount` property

---

## 🎓 Learning Resources

### Video Tutorials:
- [GA4 Tutorial for Beginners](https://www.youtube.com/results?search_query=google+analytics+4+tutorial+for+beginners)
- [Mixpanel Product Tour](https://www.youtube.com/results?search_query=mixpanel+tutorial)

### Documentation:
- [Google Analytics Docs](https://support.google.com/analytics/answer/9304153)
- [Mixpanel Docs](https://docs.mixpanel.com/)

### Courses:
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/) (Free)
- [Mixpanel University](https://mixpanel.com/university/) (Free)

---

## ⚙️ Current Implementation Status

✅ **Implemented:**
- Analytics framework (`client/src/lib/analytics.ts`)
- Google Analytics integration
- Automatic page view tracking
- Event tracking on key actions
- User identification on login
- Development mode logging

✅ **Events Being Tracked:**
- `invoice_created`, `invoice_updated`, `invoice_deleted`
- `invoice_downloaded`
- `customer_created`, `customer_updated`
- `user_signed_up`, `user_logged_in`, `user_logged_out`
- `business_profile_updated`, `logo_uploaded`

📝 **To Enable:**
1. Add `VITE_GA_MEASUREMENT_ID` to `.env`
2. Deploy to production
3. Wait 24-48 hours for data

---

## 💬 Need Help?

1. **Check console**: Browser DevTools → Console → Look for `[Analytics]` logs
2. **Verify setup**: Ensure `VITE_GA_MEASUREMENT_ID` is set correctly
3. **Test in real-time**: Use GA4 Realtime view for immediate feedback
4. **Read docs**: See `ANALYTICS_SETUP.md` for detailed guide

---

**Happy Tracking! 📈**
