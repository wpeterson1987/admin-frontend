// src/SubscriptionManagement/AddPaymentMethod.jsx
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import subscriptionService from './subscriptionService';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const AddPaymentMethod = ({ onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [makeDefault, setMakeDefault] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)
      });

      if (error) {
        throw error;
      }

      // Add the payment method to the user's account
      const response = await subscriptionService.addPaymentMethod(
        paymentMethod.id, 
        makeDefault
      );

      if (!response.success) {
        throw new Error('Failed to add payment method');
      }

      setSuccess(true);
      elements.getElement(CardElement).clear();
      if (onSuccess) {
        onSuccess(response.payment_method);
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError(err.message || 'Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <button
          className="text-gray-600 hover:text-gray-800 mr-2"
          onClick={onCancel}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">Add Payment Method</h2>
      </div>

      {success ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
          Payment method added successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Card Details</label>
            <div className="border p-3 rounded-md">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Set as default payment method</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md mr-2 hover:bg-gray-200"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={!stripe || isLoading}
            >
              {isLoading ? 'Processing...' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddPaymentMethod;