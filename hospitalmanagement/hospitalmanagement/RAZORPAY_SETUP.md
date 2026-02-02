# Razorpay Configuration Guide

## Environment Variables

To use Razorpay in production, create a `.env` file in the root of your project with the following variables:

```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

## Getting Your Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up for a new account or log in to your existing account
3. Navigate to Settings → API Keys
4. Copy your "Key ID" (starts with rzp_test_ for test mode or rzp_live_ for production)
5. Add it to your `.env` file

## Test Credentials

For testing purposes, the application comes with default test credentials:

- **Key ID**: `rzp_test_1DP5mmOlF5G5ag` (Test Key)
- **Amount**: Use any amount
- **Email**: Any email address
- **Contact**: Any phone number

### Test Card Details
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
```

## How Razorpay Integration Works

### 1. **Payment Flow**

1. User selects "Razorpay" as payment method
2. Clicks "Pay with Razorpay" button
3. Razorpay modal opens with payment options
4. User completes payment (can use card, UPI, wallet, etc.)
5. Payment status is updated in the billing system
6. Receipt can be downloaded

### 2. **Features Implemented**

- ✅ Create payment orders
- ✅ Open Razorpay payment modal
- ✅ Handle payment success/failure
- ✅ Generate payment receipts
- ✅ Store payment history
- ✅ Payment status tracking
- ✅ Bill synchronization

### 3. **Payment Methods Supported**

Through Razorpay gateway:
- 💳 Credit Cards (Visa, Mastercard, American Express)
- 💳 Debit Cards
- 📱 UPI
- 🏦 Net Banking
- 📱 Mobile Wallets (Paytm, Amazon Pay, Apple Pay, Google Pay)
- 🏤 BNPL (Buy Now Pay Later)

### 4. **Data Storage**

Payment details are stored in localStorage for demo purposes:
- `razorpay_orders` - All created orders
- `razorpay_payments` - All successful payments

**Note**: In production, use a backend API and secure database.

## Integration Points

### Files Modified
1. **src/pages/BillingPage.js**
   - Added Razorpay payment method
   - Added "Pay with Razorpay" button
   - Integrated payment modal

### Files Created
1. **src/services/razorpayService.js**
   - Payment service with order creation
   - Payment verification
   - Receipt generation
   - Payment history management

2. **src/components/Billing/RazorpayPaymentModal.js**
   - Payment modal UI
   - Order summary display
   - Payment success/failure handling
   - Receipt download functionality

3. **src/components/styles/RazorpayPayment.css**
   - Professional modal styling
   - Animations and transitions
   - Responsive design
   - Payment status displays

## Usage

### For End Users

1. Open Billing Page
2. Create a bill with charges
3. Select "🔐 Razorpay" as payment method
4. Click "Generate Bill"
5. In Bills History, click "💳 Pay with Razorpay"
6. Complete the payment in the modal
7. Download receipt after successful payment

### For Developers

```javascript
// Import Razorpay Service
import razorpayService from './services/razorpayService';

// Create an order
const order = await razorpayService.createOrder(amount, billId, patientName);

// Open payment modal
razorpayService.openPaymentModal(
  order,
  billId,
  patientName,
  (payment) => console.log('Success', payment),
  (error) => console.log('Error', error)
);

// Check payment status
const payment = razorpayService.checkPaymentStatus(billId);

// Get payment history
const payments = razorpayService.getPaymentHistory();
```

## Backend Integration (Production)

For production, implement these backend endpoints:

```
POST /api/orders - Create Razorpay order
POST /api/payments/verify - Verify payment signature
GET /api/payments - Get payment history
GET /api/payments/:billId - Get payment details
POST /api/receipts - Generate receipt
```

## Security Considerations

### Current (Development)
- Test mode with mock verification
- Data stored in localStorage
- No real transactions

### For Production
1. Move to backend API calls
2. Verify payment signatures on backend
3. Use secure database for payment storage
4. Implement proper authentication
5. Use HTTPS only
6. Never expose key IDs in frontend code
7. Follow PCI DSS compliance
8. Add rate limiting to prevent abuse
9. Log all payment transactions
10. Implement proper error handling

## Testing Scenarios

### Successful Payment
- Use test card: 4111 1111 1111 1111
- Any expiry date and CVV
- Payment will be marked as successful

### Failed Payment
- Use card: 4000 0000 0000 0002
- Payment will fail with test error

### Payment Pending
- Use card: 4000 0000 0000 0002
- Wait for webhook confirmation

## Webhook Handling (Production)

In production, handle Razorpay webhooks:

```javascript
// Example webhook for payment success
app.post('/webhook/razorpay', (req, res) => {
  const { event, payload } = req.body;
  
  if (event === 'payment.authorized') {
    // Update bill status
    // Send confirmation email
    // Update inventory if needed
  }
});
```

## Support & Documentation

- [Razorpay Official Documentation](https://razorpay.com/docs/)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payments-gateway/web-integration/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)

## Troubleshooting

### "Failed to load Razorpay"
- Check internet connection
- Verify Razorpay server is accessible
- Clear browser cache and try again

### "Payment Cancelled"
- User cancelled the payment
- Try again with valid card details

### "Invalid Order"
- Ensure order was created successfully
- Check order amount and currency
- Verify bill data is correct

## Future Enhancements

- [ ] Implement backend payment verification
- [ ] Add Razorpay webhook handling
- [ ] Implement payment refunds
- [ ] Add payment analytics dashboard
- [ ] Multiple currency support
- [ ] Subscription/Recurring payments
- [ ] Email receipts
- [ ] SMS notifications
