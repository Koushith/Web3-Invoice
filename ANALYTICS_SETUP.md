# Analytics Setup Guide

This guide explains how to view and analyze your app's analytics data.

## 📊 Overview

The app includes a comprehensive analytics framework that tracks:
- **Page views**: Which pages users visit
- **User actions**: Invoice creation, customer management, etc.
- **User identification**: Track individual user journeys
- **Performance**: Load times and errors

## 🚀 Quick Start: Google Analytics (Recommended)

### 1. Create Google Analytics Account

1. Go to [https://analytics.google.com/](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account and property
4. Choose "Web" as the platform
5. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Configure Your App

Add to your `.env` file:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Deploy and Wait

- Deploy your app to production
- Google Analytics needs 24-48 hours to start showing data
- Real-time data appears within minutes

### 4. View Your Analytics

**Google Analytics Dashboard:**
- **Reports** → **Realtime**: See live users
- **Reports** → **Engagement** → **Pages and screens**: Most visited pages
- **Reports** → **Engagement** → **Events**: Custom events (invoice_created, etc.)
- **Reports** → **User attributes**: User segments

**Key Metrics to Track:**
- **Active users**: Daily/Weekly/Monthly users
- **Page views**: Most popular pages
- **Events**: Business actions (invoices created, customers added)
- **User flow**: How users navigate your app
- **Conversion rates**: Sign-ups to paid invoices

## 📈 Analytics Dashboard Locations

### Google Analytics 4 (GA4)

**Access:** [https://analytics.google.com/](https://analytics.google.com/)

**Key Reports:**
1. **Real-time**
   - Live users on your site
   - Current page views
   - Active events

2. **Life Cycle → Acquisition**
   - How users find your app
   - Sign-up sources

3. **Life Cycle → Engagement**
   - **Events**: All tracked events (invoice_created, customer_added, etc.)
   - **Pages and screens**: Page visit stats
   - **Conversions**: Goal completions

4. **User → Demographics**
   - User locations
   - Device types
   - Browser info

5. **Explore**
   - Create custom reports
   - Funnel analysis
   - Cohort analysis

## 🎯 Tracked Events

The app automatically tracks these events:

### User Events
- `user_signed_up`: New user registration
- `user_logged_in`: User login
- `user_logged_out`: User logout

### Invoice Events
- `invoice_created`: New invoice created
  - Properties: `invoiceId`, `amount`, `currency`
- `invoice_updated`: Invoice edited
- `invoice_deleted`: Invoice removed
- `invoice_downloaded`: Invoice PDF downloaded
  - Properties: `format` (pdf/png)

### Customer Events
- `customer_created`: New customer added
- `customer_updated`: Customer edited

### Business Events
- `business_profile_updated`: Company info changed
- `logo_uploaded`: Logo/icon uploaded

## 🔍 Custom Event Tracking

Add your own events:

```typescript
import { analytics } from '@/lib/analytics';

// Track custom event
analytics.track('feature_used', {
  feature: 'bulk_invoice_send',
  count: 5
});

// Track specific business event
analytics.events.invoiceCreated('INV-123', 1500, 'USD');
```

## 📱 Alternative: Mixpanel (Advanced)

For more detailed user analytics:

1. Sign up at [https://mixpanel.com/](https://mixpanel.com/)
2. Get your project token
3. Add to `.env`:
   ```bash
   VITE_MIXPANEL_TOKEN=your_token_here
   ```
4. Uncomment Mixpanel code in `client/src/lib/analytics.ts`

**Mixpanel Benefits:**
- User cohort analysis
- A/B testing support
- Retention tracking
- Funnel visualization

## 🛠️ Development Mode

In development, analytics logs to console:
```
[Analytics] Event: invoice_created { invoiceId: '123', amount: 1500 }
[Analytics] Page View: /invoices
```

This helps you debug without polluting production data.

## 📊 Building Internal Dashboards

For custom internal dashboards, you can:

1. **Use MongoDB aggregations** to create reports
2. **Build a `/admin/analytics` page** showing:
   - Total invoices created today/week/month
   - Revenue metrics
   - Customer growth
   - Most active users

Example query for MongoDB:
```javascript
// Get invoice stats
const stats = await Invoice.aggregate([
  { $match: { organizationId: orgId } },
  { $group: {
    _id: null,
    totalInvoices: { $sum: 1 },
    totalRevenue: { $sum: '$total' },
    avgInvoiceValue: { $avg: '$total' }
  }}
]);
```

## 🔐 Privacy & GDPR

The analytics setup respects user privacy:
- No PII (Personally Identifiable Information) is sent by default
- User IDs are anonymized Firebase UIDs
- Can be disabled per user with cookie consent

To add cookie consent:
1. Install a consent banner library
2. Only initialize analytics after user consent
3. Provide opt-out option in settings

## 📈 Recommended Dashboards

**For Founders:**
- Sign-ups per week
- Invoice conversion rate (drafts → sent → paid)
- Revenue growth
- Customer retention

**For Product:**
- Feature usage stats
- Page flow analysis
- Drop-off points
- Error rates

**For Support:**
- Active users
- Most used features
- Common user paths

## 🎓 Learning Resources

- [Google Analytics 4 Docs](https://support.google.com/analytics/answer/9304153)
- [GA4 YouTube Tutorials](https://www.youtube.com/results?search_query=google+analytics+4+tutorial)
- [Mixpanel Documentation](https://docs.mixpanel.com/)

## ⚡ Quick Tips

1. **Set up goals**: Define key conversions (e.g., first invoice sent)
2. **Create custom reports**: Focus on metrics that matter to your business
3. **Set up alerts**: Get notified of traffic spikes or drops
4. **Export data**: Download reports for deeper analysis
5. **Compare periods**: Week-over-week, month-over-month growth

---

**Need Help?** Check the analytics console in your browser's DevTools to see if events are firing correctly.
