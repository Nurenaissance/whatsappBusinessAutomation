import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, Smartphone, Calendar, Shield, Clock, CreditCard } from 'lucide-react';

const CAN_MAKE_PAYMENT_CACHE = 'canMakePaymentCache';

const GPayUPIPayment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const subscriptionData = {
    currentPlan: 'basic',
    startDate: '2024-01-01',
    nextBillingDate: '2024-07-01',
    daysRemaining: 25,
    paymentHistory: [
      { date: '2024-01-01', amount: 5000, status: 'success' },
      { date: '2023-12-01', amount: 5000, status: 'success' },
    ]
  };
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 5000,
      description: 'Perfect for individuals and small teams',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      popular: false,
      billingCycle: 'Monthly'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 11000,
      description: 'Advanced features for growing businesses',
      features: ['All Basic Features', 'Feature 4', 'Feature 5', 'Feature 6'],
      popular: true,
      billingCycle: 'Monthly'
    }
  ];

  const merchantInfo = {
    vpa: 'cnurenai@kotak',
    name: 'NURENAISSANCEFABRICA',
    merchantCode: '1234',
    gstin: '29ABCDE1234F2Z5'
  };

  useEffect(() => {
    setIsDesktop(!/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createPaymentRequest = (planDetails) => {
    const transactionId = generateTransactionId();
    
    const supportedInstruments = [{
      supportedMethods: 'https://tez.google.com/pay',
      data: {
        pa: merchantInfo.vpa,
        pn: merchantInfo.name,
        tr: transactionId,
        url: window.location.origin,
        mc: merchantInfo.merchantCode,
        tn: `Payment for ${planDetails.name}`,
        gstIn: merchantInfo.gstin,
        invoiceNo: `INV_${transactionId}`,
        invoiceDate: new Date().toISOString()
      }
    }];

    const details = {
      total: {
        label: planDetails.name,
        amount: {
          currency: 'INR',
          value: planDetails.price.toFixed(2)
        }
      },
      displayItems: [{
        label: 'Original Amount',
        amount: {
          currency: 'INR',
          value: planDetails.price.toFixed(2)
        }
      }]
    };

    try {
      return new PaymentRequest(supportedInstruments, details);
    } catch (e) {
    //  console.error('Payment Request Error:', e.message);
      return null;
    }
  };

  const checkCanMakePayment = async (request) => {
    if (sessionStorage.hasOwnProperty(CAN_MAKE_PAYMENT_CACHE)) {
      return JSON.parse(sessionStorage[CAN_MAKE_PAYMENT_CACHE]);
    }

    let canMakePaymentPromise = Promise.resolve(true);

    if (request.canMakePayment) {
      canMakePaymentPromise = request.canMakePayment();
    }

    try {
      const result = await canMakePaymentPromise;
      sessionStorage[CAN_MAKE_PAYMENT_CACHE] = JSON.stringify(result);
      return result;
    } catch (err) {
    //  console.error('Error checking canMakePayment:', err);
      return false;
    }
  };

  const processPaymentResponse = async (response) => {
    try {
      // Convert payment response to JSON
      const responseData = {
        methodName: response.methodName,
        details: response.details,
        payerName: response.payerName,
        payerPhone: response.payerPhone,
        payerEmail: response.payerEmail
      };

      // Send to your server for verification
      const result = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });

      if (!result.ok) {
        throw new Error('Payment verification failed');
      }

      const verificationResult = await result.json();
      
      // Complete the payment
      await response.complete(verificationResult.success ? 'success' : 'fail');
      
      return verificationResult;
    } catch (err) {
    //  console.error('Payment processing error:', err);
      throw err;
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);

      if (!window.PaymentRequest) {
        throw new Error('Web payments are not supported in this browser');
      }

      const request = createPaymentRequest(selectedPlanDetails);
      if (!request) {
        throw new Error('Failed to create payment request');
      }

      const canMakePayment = await checkCanMakePayment(request);
      if (!canMakePayment) {
        throw new Error('Google Pay is not available on this device');
      }

      const response = await request.show();
      const result = await processPaymentResponse(response);

      if (result.success) {
        // Handle successful payment (e.g., redirect to success page)
        //console.log('Payment successful!');
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message);
    //  console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center border-b bg-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Your Subscription Status</CardTitle>
          <p className="text-gray-600 mt-2">Manage your plan and payments</p>
        </CardHeader>
        
        {/* Subscription Progress Section */}
        <div className="border-b bg-blue-50 p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-lg font-bold">{subscriptionData.daysRemaining} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Next Billing Date</p>
                <p className="text-lg font-bold">{new Date(subscriptionData.nextBillingDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-lg font-bold capitalize">{subscriptionData.currentPlan}</p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Payment History */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Recent Payments</h3>
              <div className="space-y-2">
                {subscriptionData.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                    <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-blue-50 p-3 rounded-lg mb-6">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Secure UPI Payment</span>
            </div>

            <RadioGroup
              value={selectedPlan}
              onValueChange={(value) => {
                setSelectedPlan(value);
                setShowQR(false);
                setError('');
              }}
              className="grid md:grid-cols-2 gap-4"
            >
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative flex flex-col border-2 rounded-xl p-6 hover:border-blue-500 transition-all
                    ${selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${subscriptionData.currentPlan === plan.id ? 'ring-2 ring-blue-200' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 right-4 bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  {subscriptionData.currentPlan === plan.id && (
                    <Badge className="absolute -top-3 left-4 bg-green-500">
                      Current Plan
                    </Badge>
                  )}
                  <RadioGroupItem value={plan.id} id={plan.id} className="absolute right-4 top-4" />
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        ₹{plan.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">per {plan.billingCycle.toLowerCase()}</div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showQR && selectedPlan && (
              <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border">
                <img 
                  src="/path-to-your-qr-code.webp" 
                  alt="Payment QR Code" 
                  className="w-48 h-48"
                />
                <p className="text-sm text-gray-600">Scan with any UPI app to pay</p>
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              <Button 
                onClick={handlePayment}
                className="w-full max-w-md bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                disabled={!selectedPlan}
              >
                
                  <Smartphone className="mr-2 h-5 w-5" />
                
                {selectedPlan 
                  ? selectedPlan === subscriptionData.currentPlan 
                    ? 'Current Active Plan'
                    : `Pay ₹${plans.find(p => p.id === selectedPlan).price.toLocaleString()}`
                  : 'Select a plan to continue'}
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                Secured by Google Pay UPI
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GPayUPIPayment;