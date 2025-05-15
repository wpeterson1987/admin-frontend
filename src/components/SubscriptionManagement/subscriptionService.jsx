// src/SubscriptionManagement/subscriptionService.jsx
import axios from 'axios';

// Base API URL - replace with your actual API base URL if different
const API_URL = process.env.REACT_APP_API_URL || '/api';
const BASE_URL = `${API_URL}/subscriptions`;

/**
 * Get the current user's family subscription
 * @returns {Promise<Object>} Current subscription details
 */
export const getCurrentSubscription = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/current`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current subscription:', error);
    throw error;
  }
};

/**
 * Get all available subscription plans, optionally filtered by app name
 * @param {string} appName - Optional app name to filter plans
 * @returns {Promise<Object>} Available plans
 */
export const getAvailablePlans = async (appName = null) => {
  try {
    const url = appName ? `${BASE_URL}/plans?app_name=${appName}` : `${BASE_URL}/plans`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available plans:', error);
    throw error;
  }
};

/**
 * Calculate prorated amount for subscription plan change
 * @param {string} currentPlanId - Current plan ID (format: "tierId_billingCycle")
 * @param {string} newPlanId - New plan ID (format: "tierId_billingCycle")
 * @returns {Promise<Object>} Proration details
 */
export const calculateProration = async (currentPlanId, newPlanId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/proration`,
      { current_plan_id: currentPlanId, new_plan_id: newPlanId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error calculating proration:', error);
    throw error;
  }
};

/**
 * Change subscription plan
 * @param {Object} data - Plan change data
 * @param {string} data.plan_id - New plan ID (format: "tierId_billingCycle")
 * @param {string} [data.payment_method_id] - Optional payment method ID
 * @param {string} [data.proration_behavior] - How to handle prorations ('create_prorations' or 'none')
 * @param {boolean} [data.effective_immediately] - Whether changes take effect immediately
 * @returns {Promise<Object>} Updated subscription details
 */
export const changeSubscriptionPlan = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}/current`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    throw error;
  }
};

/**
 * Get all payment methods for the current family
 * @returns {Promise<Object>} Payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/payment-methods`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Add a new payment method
 * @param {string} paymentMethodToken - Payment method token from Stripe
 * @param {boolean} setAsDefault - Whether to set as default payment method
 * @returns {Promise<Object>} Newly added payment method
 */
export const addPaymentMethod = async (paymentMethodToken, setAsDefault = false) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payment-methods`,
      {
        payment_method_token: paymentMethodToken,
        set_as_default: setAsDefault
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

/**
 * Set a payment method as default
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<Object>} Success response
 */
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/payment-methods/${paymentMethodId}/default`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

/**
 * Get subscription tiers
 * @returns {Promise<Object>} Subscription tiers
 */
export const getSubscriptionTiers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tiers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    throw error;
  }
};

/**
 * Get family subscription details
 * @param {string} familyId - Family ID
 * @returns {Promise<Object>} Family subscription details
 */
export const getFamilySubscription = async (familyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/family/${familyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching family subscription:', error);
    throw error;
  }
};

/**
 * Create a new subscription
 * @param {Object} data - Subscription data
 * @param {string} data.familyId - Family ID
 * @param {string} data.subscriptionTierId - Subscription tier ID
 * @param {string} data.paymentMethodId - Payment method ID
 * @param {string} data.billingEmail - Billing email
 * @param {number} [data.trialPeriodDays] - Optional trial period days
 * @returns {Promise<Object>} New subscription details
 */
export const createSubscription = async (data) => {
  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Update an existing subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {Object} data - Update data
 * @param {string} data.newTierId - New tier ID
 * @param {string} [data.prorationBehavior] - How to handle prorations
 * @returns {Promise<Object>} Updated subscription details
 */
export const updateSubscription = async (subscriptionId, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/${subscriptionId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {boolean} [cancelImmediately=false] - Whether to cancel immediately
 * @returns {Promise<Object>} Canceled subscription details
 */
export const cancelSubscription = async (subscriptionId, cancelImmediately = false) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        cancelImmediately
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Export all functions as a service object
const subscriptionService = {
  getCurrentSubscription,
  getAvailablePlans,
  calculateProration,
  changeSubscriptionPlan,
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  getSubscriptionTiers,
  getFamilySubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription
};

export default subscriptionService;