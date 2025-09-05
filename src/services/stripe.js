import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key missing. Payment features will not work.');
}

let stripePromise;
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
}

export const paymentService = {
  // Initialize Stripe
  getStripe: async () => {
    if (!stripePromise) {
      throw new Error('Stripe not configured');
    }
    return await stripePromise;
  },

  // Create subscription checkout session
  createSubscriptionCheckout: async (priceId, userId, successUrl, cancelUrl) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl,
          mode: 'subscription'
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating subscription checkout:', error);
      throw error;
    }
  },

  // Create one-time payment checkout
  createPaymentCheckout: async (amount, currency, description, successUrl, cancelUrl) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          successUrl,
          cancelUrl,
          mode: 'payment'
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating payment checkout:', error);
      throw error;
    }
  },

  // Get customer subscription status
  getSubscriptionStatus: async (customerId) => {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get subscription status');
      }

      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },

  // Create customer portal session
  createPortalSession: async (customerId, returnUrl) => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to customer portal
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }
};

// Subscription plans configuration
export const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic rights guides',
      'Simple scripts',
      'Limited incident reports'
    ]
  },
  premium: {
    name: 'Premium',
    price: 4.99,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Advanced AI-generated scripts',
      'Unlimited incident recording',
      'Cloud storage for reports',
      'Offline access',
      'Priority support',
      'Legal update alerts'
    ]
  }
};
