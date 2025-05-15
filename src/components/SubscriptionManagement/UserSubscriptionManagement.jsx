// src/SubscriptionManagement/UserSubscriptionManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, CreditCard, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import subscriptionService from './subscriptionService';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  
  // State
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [isChangingPaymentMethod, setIsChangingPaymentMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [proratedAmount, setProratedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current subscription
        const { success, subscription } = await subscriptionService.getCurrentSubscription();
        
        if (!success) {
          throw new Error('Failed to fetch current subscription');
        }
        
        setCurrentPlan(subscription.plan);
        setBillingCycle(subscription.plan.billing_cycle);
        
        // Fetch available plans
        const plansResponse = await subscriptionService.getAvailablePlans(subscription.plan.app_name);
        
        if (!plansResponse.success) {
          throw new Error('Failed to fetch available plans');
        }
        
        setAvailablePlans(plansResponse.plans);
        
        // Set the current plan as the selected plan initially
        const currentPlanFromAvailable = plansResponse.plans.find(
          plan => plan.tier === subscription.plan.tier && 
                 plan.billing_cycle === subscription.plan.billing_cycle
        );
        
        setSelectedPlan(currentPlanFromAvailable);
        
        // Set payment methods
        if (subscription.payment_methods) {
          setPaymentMethods(subscription.payment_methods);
          
          // Set default payment method as selected
          const defaultPaymentMethod = subscription.payment_methods.find(pm => pm.is_default);
          if (defaultPaymentMethod) {
            setSelectedPaymentMethod(defaultPaymentMethod.id);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError('Failed to load subscription data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate proration when plan changes
  useEffect(() => {
    const getProratedAmount = async () => {
      if (selectedPlan && currentPlan && isPlanChange()) {
        try {
          const currentPlanId = `${currentPlan.id}_${billingCycle}`;
          const newPlanId = selectedPlan.id;
          
          const { success, prorated_amount } = await subscriptionService.calculateProration(
            currentPlanId,
            newPlanId
          );
          
          if (success) {
            setProratedAmount(prorated_amount);
          }
        } catch (err) {
          console.error('Error calculating proration:', err);
          setProratedAmount(0);
        }
      } else {
        setProratedAmount(0);
      }
    };
    
    getProratedAmount();
  }, [selectedPlan, currentPlan, billingCycle]);
  
  // Select a plan
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(false);
  };
  
  // Get plans for the current billing cycle
  const getPlansForBillingCycle = (cycle) => {
    return availablePlans.filter(plan => plan.billing_cycle === cycle);
  };
  
  // Continue to confirmation
  const handleContinue = () => {
    setShowConfirmation(true);
  };
  
  // Confirm plan change
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Call API to change subscription plan
      const response = await subscriptionService.changeSubscriptionPlan({
        plan_id: selectedPlan.id,
        payment_method_id: selectedPaymentMethod,
        proration_behavior: 'create_prorations',
        effective_immediately: true
      });
      
      if (response.success) {
        // Update local state with new plan
        setCurrentPlan({
          ...selectedPlan,
          billing_cycle: billingCycle
        });
        
        setShowConfirmation(false);
        setIsLoading(false);
        
        // Show success message
        alert('Subscription updated successfully!');
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (err) {
      console.error('Error updating subscription:', err);
      setIsLoading(false);
      alert('Failed to update subscription. Please try again.');
    }
  };
  
  // Handle setting a payment method as default
  const handleSetDefaultPaymentMethod = async (methodId) => {
    try {
      const response = await subscriptionService.setDefaultPaymentMethod(methodId);
      
      if (response.success) {
        // Update payment methods in state
        const updatedPaymentMethods = paymentMethods.map(method => ({
          ...method,
          is_default: method.id === methodId
        }));
        
        setPaymentMethods(updatedPaymentMethods);
        setSelectedPaymentMethod(methodId);
      }
    } catch (err) {
      console.error('Error setting default payment method:', err);
      alert('Failed to set default payment method. Please try again.');
    }
  };
  
  // Determine if the selected plan is different from current plan
  const isPlanChange = () => {
    if (!selectedPlan || !currentPlan) return false;
    return selectedPlan.tier !== currentPlan.tier || selectedPlan.billing_cycle !== currentPlan.billing_cycle;
  };
  
  // Toggle comparison table
  const toggleComparisonTable = () => {
    setShowComparisonTable(!showComparisonTable);
  };
  
  // All possible features across all plans for comparison table
  const allFeatures = availablePlans.length > 0 
    ? [...new Set(availablePlans.flatMap(plan => plan.features))]
    : [];
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subscription details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Subscription</h1>
      
      {/* Current Plan Section */}
      {currentPlan && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Plan</h2>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-700">
                <span className="font-medium">{currentPlan.name}</span> (${currentPlan.price}/{currentPlan.billing_cycle === 'monthly' ? 'month' : 'year'})
              </p>
              {/* Show renewal date if available */}
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm font-medium">
              Current Plan
            </div>
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing Cycle</h2>
        <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg w-fit">
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              billingCycle === 'yearly' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly (Save 16%)
          </button>
        </div>
      </div>
      
      {/* Available Plans Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Available Plans</h2>
          <button 
            onClick={toggleComparisonTable}
            className="text-blue-600 flex items-center text-sm"
          >
            {showComparisonTable ? (
              <>
                Hide Comparison Table <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Show Comparison Table <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
        
        {/* Comparison Table (Toggle) */}
        {showComparisonTable && availablePlans.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Feature</th>
                  {getPlansForBillingCycle(billingCycle).map((plan) => (
                    <th key={plan.id} className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 text-sm text-gray-700">{feature}</td>
                    {getPlansForBillingCycle(billingCycle).map((plan) => (
                      <td key={`${plan.id}-${index}`} className="py-3 px-4 text-sm text-gray-700">
                        {plan.features.includes(feature) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">Price</td>
                  {getPlansForBillingCycle(billingCycle).map((plan) => (
                    <td key={`${plan.id}-price`} className="py-3 px-4 text-sm font-medium text-gray-700">
                      ${plan.price}/{billingCycle === 'monthly' ? 'month' : 'year'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getPlansForBillingCycle(billingCycle).map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </p>
                </div>
                {currentPlan && currentPlan.tier === plan.tier && currentPlan.billing_cycle === plan.billing_cycle && (
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                    Current
                  </div>
                )}
              </div>
              
              <ul className="space-y-2 mb-4">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-sm text-blue-600">+{plan.features.length - 4} more features</li>
                )}
              </ul>
              
              {plan.tier === 'Professional' && currentPlan && plan.tier !== currentPlan.tier && (
                <div className="text-sm text-gray-600 mb-4">
                  Upgrade to access all features
                </div>
              )}
              
              <button
                className={`w-full py-2 px-4 rounded-md ${
                  selectedPlan?.id === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect(plan);
                }}
              >
                {currentPlan && currentPlan.tier === plan.tier && currentPlan.billing_cycle === plan.billing_cycle 
                  ? 'Current Plan' 
                  : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Section */}
      {isPlanChange() && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Plan Change Summary</h2>
              {selectedPlan && currentPlan && selectedPlan.tier !== currentPlan.tier && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPlan.tier === 'Professional' ? 'Upgrading' : 'Downgrading'} from {currentPlan.tier} to {selectedPlan.tier}
                </p>
              )}
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
          
          {selectedPlan && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">New plan:</span>
                <span className="font-medium">{selectedPlan.name} ({billingCycle})</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">New price:</span>
                <span className="font-medium">
                  ${selectedPlan.price}/{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {proratedAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Prorated charge today:</span>
                  <span className="font-medium">${proratedAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Changes effective:</span>
                <span className="font-medium">Immediately</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Subscription Change</h3>
            <p className="text-gray-600 mb-6">
              You're about to {selectedPlan.tier === 'Professional' ? 'upgrade to' : 'switch to'} the {selectedPlan.name} plan ({billingCycle}).
              {proratedAmount > 0 && ` You'll be charged $${proratedAmount.toFixed(2)} today for the prorated difference.`}
            </p>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
              {!isChangingPaymentMethod ? (
                <div className="flex justify-between items-center">
                  {paymentMethods.length > 0 && selectedPaymentMethod ? (
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.brand} ending in {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.last4}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-600">No payment method available</span>
                  )}
                  <button 
                    className="text-blue-600 text-sm"
                    onClick={() => setIsChangingPaymentMethod(true)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div 
                      key={method.id}
                      className={`border rounded-md p-3 flex justify-between items-center cursor-pointer ${
                        selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {method.brand} •••• {method.last4} (expires {method.exp_month}/{method.exp_year})
                        </span>
                      </div>
                      {method.is_default && (
                        <span className="text-xs text-gray-500">Default</span>
                      )}
                    </div>
                  ))}
                  <button 
                    className="text-blue-600 text-sm flex items-center"
                    onClick={() => setIsChangingPaymentMethod(false)}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" /> Add new payment method
                  </button>
                </div>
              )}
            </div>
            
            {/* Important Notes */}
            <div className="bg-yellow-50 p-3 rounded-md mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  By confirming, you agree to the updated subscription terms. Your new billing cycle will start immediately.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Change'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;