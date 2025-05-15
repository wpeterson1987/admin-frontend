import React, { useState, useEffect } from 'react';
import { CheckCircle, X, CreditCard, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data - in a real app, this would come from your API
const CURRENT_PLAN = {
  tier: 'Basic',
  name: 'LaiTasks Basic',
  price: 10,
  billingCycle: 'monthly',
  features: [
    'Unified Dashboard',
    'Context Tagging',
    'Time Allocation Tracking',
    'Basic Shared Lists'
  ],
  renewalDate: '2025-06-15'
};

const AVAILABLE_PLANS = [
  {
    id: 'basic',
    tier: 'Basic',
    name: 'LaiTasks Basic',
    price: 10,
    yearlyPrice: 100, // 2 months free with yearly
    features: [
      'Unified Dashboard',
      'Context Tagging',
      'Time Allocation Tracking',
      'Basic Shared Lists'
    ]
  },
  {
    id: 'professional',
    tier: 'Professional',
    name: 'LaiTasks Professional',
    price: 25,
    yearlyPrice: 250, // 2 months free with yearly
    features: [
      'Unified Dashboard',
      'Context Tagging',
      'Time Allocation Tracking',
      'Basic Shared Lists',
      'Role-Based Access',
      'Life Balance Analytics',
      'Calendar Integration',
      'Household Project Management',
      'Family Member Accounts',
      'Shared Resources'
    ]
  }
];

// Mock payment methods
const PAYMENT_METHODS = [
  { id: 'pm_1', last4: '4242', brand: 'Visa', expMonth: 12, expYear: 2025, isDefault: true },
  { id: 'pm_2', last4: '5555', brand: 'Mastercard', expMonth: 10, expYear: 2026, isDefault: false }
];

const SubscriptionPlanChange = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [isChangingPaymentMethod, setIsChangingPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS.find(pm => pm.isDefault)?.id
  );
  
  // Calculate prorated amount (this would be done by your backend in a real app)
  const proratedAmount = selectedPlan ? 
    ((selectedPlan.price - CURRENT_PLAN.price) / 30 * 20).toFixed(2) : 0;

  // Find current plan from available plans
  useEffect(() => {
    const currentPlanFromAvailable = AVAILABLE_PLANS.find(
      plan => plan.tier === CURRENT_PLAN.tier
    );
    setSelectedPlan(currentPlanFromAvailable);
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(false);
  };

  const getPrice = (plan) => {
    if (!plan) return 0;
    return billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
  };

  const handleContinue = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Here you would call your API to update the subscription
    alert('Subscription updated successfully!');
    setShowConfirmation(false);
  };

  // Function to determine if the selected plan is different from current plan
  const isPlanChange = () => {
    if (!selectedPlan) return false;
    return selectedPlan.tier !== CURRENT_PLAN.tier || billingCycle !== CURRENT_PLAN.billingCycle;
  };

  const toggleComparisonTable = () => {
    setShowComparisonTable(!showComparisonTable);
  };

  // All possible features across all plans for comparison table
  const allFeatures = [...new Set(AVAILABLE_PLANS.flatMap(plan => plan.features))];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Subscription</h1>
      
      {/* Current Plan Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Plan</h2>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">{CURRENT_PLAN.name}</span> (${CURRENT_PLAN.price}/month)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Renews on {new Date(CURRENT_PLAN.renewalDate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm font-medium">
            Current Plan
          </div>
        </div>
      </div>

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
        {showComparisonTable && (
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Feature</th>
                  {AVAILABLE_PLANS.map((plan) => (
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
                    {AVAILABLE_PLANS.map((plan) => (
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
                  {AVAILABLE_PLANS.map((plan) => (
                    <td key={`${plan.id}-price`} className="py-3 px-4 text-sm font-medium text-gray-700">
                      ${billingCycle === 'monthly' ? plan.price : plan.yearlyPrice}/{billingCycle === 'monthly' ? 'month' : 'year'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AVAILABLE_PLANS.map((plan) => (
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
                    ${getPrice(plan)}
                    <span className="text-sm font-normal text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </p>
                </div>
                {CURRENT_PLAN.tier === plan.tier && (
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
              
              {plan.tier === 'Professional' && plan.tier !== CURRENT_PLAN.tier && (
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
                {CURRENT_PLAN.tier === plan.tier ? 'Current Plan' : 'Select'}
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
              {selectedPlan && selectedPlan.tier !== CURRENT_PLAN.tier && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPlan.tier === 'Professional' ? 'Upgrading' : 'Downgrading'} from {CURRENT_PLAN.tier} to {selectedPlan.tier}
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
                  ${getPrice(selectedPlan)}/{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {selectedPlan.tier !== CURRENT_PLAN.tier && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Prorated charge today:</span>
                  <span className="font-medium">${proratedAmount}</span>
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
              {selectedPlan.tier !== CURRENT_PLAN.tier && ` You'll be charged $${proratedAmount} today for the prorated difference.`}
            </p>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
              {!isChangingPaymentMethod ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">
                      {PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod)?.brand} ending in {PAYMENT_METHODS.find(pm => pm.id === selectedPaymentMethod)?.last4}
                    </span>
                  </div>
                  <button 
                    className="text-blue-600 text-sm"
                    onClick={() => setIsChangingPaymentMethod(true)}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(method => (
                    <div 
                      key={method.id}
                      className={`border rounded-md p-3 flex justify-between items-center cursor-pointer ${
                        selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {method.brand} •••• {method.last4} (expires {method.expMonth}/{method.expYear})
                        </span>
                      </div>
                      {method.isDefault && (
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
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanChange;