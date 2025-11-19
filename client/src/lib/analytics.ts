/**
 * Analytics utility for tracking user events and app performance
 * Integrates with popular analytics services (Google Analytics, Mixpanel, etc.)
 */

const isProduction = import.meta.env.PROD;

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface EventProperties {
  [key: string]: any;
}

interface UserProperties {
  userId?: string;
  email?: string;
  organizationId?: string;
  [key: string]: any;
}

class Analytics {
  private initialized = false;

  /**
   * Initialize analytics services
   */
  init() {
    if (this.initialized) {
      return;
    }

    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

    // Initialize Google Analytics (GA4) - now works in all environments
    if (GA_MEASUREMENT_ID) {
      // Load GA4 script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // We'll handle page views manually
      });

      console.log('[Analytics] Google Analytics initialized with ID:', GA_MEASUREMENT_ID);
    } else {
      console.warn('[Analytics] GA_MEASUREMENT_ID not found in environment variables');
    }

    // Example: Mixpanel (uncomment if using)
    // const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
    // if (MIXPANEL_TOKEN) {
    //   mixpanel.init(MIXPANEL_TOKEN);
    // }

    this.initialized = true;
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    // Always log in development for debugging
    if (!isProduction) {
      console.log('[Analytics] Page View:', { path, title });
    }

    // Google Analytics page view
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    }
  }

  /**
   * Track custom event
   */
  track(eventName: string, properties?: EventProperties) {
    // Always log in development for debugging
    if (!isProduction) {
      console.log('[Analytics] Event:', eventName, properties);
    }

    // Google Analytics event
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }

    // Mixpanel (if initialized)
    // if ((window as any).mixpanel) {
    //   (window as any).mixpanel.track(eventName, properties);
    // }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: UserProperties) {
    // Always log in development for debugging
    if (!isProduction) {
      console.log('[Analytics] Identify:', userId, properties);
    }

    // Google Analytics user identification
    if ((window as any).gtag) {
      (window as any).gtag('set', { user_id: userId });
      if (properties) {
        (window as any).gtag('set', 'user_properties', properties);
      }
    }

    // Mixpanel (if initialized)
    // if ((window as any).mixpanel) {
    //   (window as any).mixpanel.identify(userId);
    //   if (properties) {
    //     (window as any).mixpanel.people.set(properties);
    //   }
    // }
  }

  /**
   * Track timing/performance
   */
  timing(category: string, variable: string, value: number) {
    if (!isProduction) {
      console.log('[Analytics] Timing:', { category, variable, value });
      return;
    }

    // TODO: Implement actual timing tracking
    // gtag('event', 'timing_complete', {
    //   name: variable,
    //   value: value,
    //   event_category: category,
    // });
  }

  /**
   * Track error
   */
  error(error: Error, context?: EventProperties) {
    if (!isProduction) {
      console.error('[Analytics] Error:', error, context);
      return;
    }

    // Always track errors even in production
    // TODO: Implement error tracking (Sentry, LogRocket, etc.)
    // Sentry.captureException(error, { extra: context });

    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Common event tracking helpers
   */
  events = {
    // Invoice events
    invoiceCreated: (invoiceId: string, amount: number, currency: string) => {
      this.track('invoice_created', { invoiceId, amount, currency });
    },
    invoiceUpdated: (invoiceId: string) => {
      this.track('invoice_updated', { invoiceId });
    },
    invoiceDeleted: (invoiceId: string) => {
      this.track('invoice_deleted', { invoiceId });
    },
    invoiceDownloaded: (invoiceId: string, format: string) => {
      this.track('invoice_downloaded', { invoiceId, format });
    },

    // Customer events
    customerCreated: (customerId: string) => {
      this.track('customer_created', { customerId });
    },
    customerUpdated: (customerId: string) => {
      this.track('customer_updated', { customerId });
    },

    // User events
    userSignedUp: (method: string) => {
      this.track('user_signed_up', { method });
    },
    userLoggedIn: (method: string) => {
      this.track('user_logged_in', { method });
    },
    userLoggedOut: () => {
      this.track('user_logged_out');
    },

    // Business events
    businessProfileUpdated: () => {
      this.track('business_profile_updated');
    },
    logoUploaded: (type: 'icon' | 'logo') => {
      this.track('logo_uploaded', { type });
    },
  };
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-initialize
analytics.init();
