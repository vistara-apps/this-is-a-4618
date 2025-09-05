import React from 'react';
import { X, Check, Crown, Shield } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { subscriptionPlans, paymentService } from '../../services/stripe';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const PricingModal = ({ isOpen, onClose }) => {
  const { user, isPremium } = useAuth();

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    try {
      const successUrl = `${window.location.origin}/subscription-success`;
      const cancelUrl = `${window.location.origin}/subscription-cancelled`;
      
      await paymentService.createSubscriptionCheckout(
        subscriptionPlans.premium.priceId,
        user.id,
        successUrl,
        cancelUrl
      );
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <Card variant="glass" className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
            <p className="text-white/70">Protect your rights with the right tools</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card variant="outline" className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-white/70" />
                <h3 className="text-xl font-semibold text-white">Free</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  $0<span className="text-lg font-normal text-white/70">/month</span>
                </div>
                <p className="text-white/60">Essential rights protection</p>
              </div>

              <ul className="space-y-3 mb-6">
                {subscriptionPlans.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                className="w-full"
                disabled
              >
                Current Plan
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card variant="glass" className="p-6 relative border-2 border-accent">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-medium">
                  RECOMMENDED
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-semibold text-white">Premium</h3>
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  ${subscriptionPlans.premium.price}
                  <span className="text-lg font-normal text-white/70">/month</span>
                </div>
                <p className="text-white/60">Complete legal protection suite</p>
              </div>

              <ul className="space-y-3 mb-6">
                {subscriptionPlans.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleUpgrade}
                disabled={isPremium()}
              >
                {isPremium() ? 'Current Plan' : 'Upgrade to Premium'}
              </Button>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm mb-4">
              All plans include our core rights guides and basic incident reporting
            </p>
            <div className="flex items-center justify-center gap-6 text-white/50 text-xs">
              <span>✓ 30-day money-back guarantee</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PricingModal;
