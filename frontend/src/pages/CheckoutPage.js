import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { saveShippingAddress, savePaymentMethod, clearCart } from '../features/cart/cartSlice';
import { formatInr } from '../utils/currency';

const steps = ['Shipping', 'Payment', 'Review & Place Order'];

const CheckoutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    firstName: userInfo?.name?.split(' ')[0] || '',
    lastName: userInfo?.name?.split(' ')[1] || 'Customer',
    email: userInfo?.email || '',
    phone: shippingAddress?.phone || '',
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || 'Maharashtra',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || 'India',
  });

  const [paymentMethodValue, setPaymentMethodValue] = useState(paymentMethod || 'cash_on_delivery');

  // Dynamic calculations in Indian Rupees
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
  const shippingAmount = subtotal > 50000 || subtotal === 0 ? 0 : 500;
  const taxAmount = Math.round(subtotal * 0.03); // 3% Indian GST
  const total = subtotal + shippingAmount + taxAmount;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(shippingForm));
    setActiveStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodValue));
    setActiveStep(2);
  };

  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const orderPayload = {
        orderItems: cartItems.map(item => ({
          productId: item.product || item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
          image: item.image,
        })),
        shippingInfo: shippingForm,
        paymentMethod: paymentMethodValue,
        subtotal,
        shippingAmount,
        taxAmount,
        total,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {})
        },
        withCredentials: true,
      };

      const { data } = await axios.post('/api/orders', orderPayload, config);

      if (data?.success && data?.order) {
        setPlacedOrder(data.order);
        dispatch(clearCart());
        setActiveStep(3); // Navigate to success step
      } else {
        throw new Error(data?.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.response?.data?.error || err.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleShippingSubmit}>
            <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
              Shipping & Delivery Information
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={shippingForm.firstName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={shippingForm.lastName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={shippingForm.email}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Contact Phone (+91)"
                  placeholder="9876543210"
                  value={shippingForm.phone}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  name="address"
                  label="Street Address / Flat No."
                  value={shippingForm.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  value={shippingForm.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  name="state"
                  label="State"
                  value={shippingForm.state}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="postalCode"
                  name="postalCode"
                  label="PIN Code"
                  value={shippingForm.postalCode}
                  onChange={handleShippingChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#D4AF37',
                  color: '#000',
                  borderRadius: '2px',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#b89428' },
                }}
              >
                Proceed to Payment
              </Button>
            </Box>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handlePaymentSubmit}>
            <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
              Payment Selection
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, mb: 3, backgroundColor: '#222', borderColor: 'rgba(212,175,55,0.2)' }}>
              <FormControl component="fieldset">
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethodValue}
                  onChange={(e) => setPaymentMethodValue(e.target.value)}
                >
                  <FormControlLabel
                    value="cash_on_delivery"
                    control={<Radio sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Cash on Delivery / Pay on Delivery</Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                          Available for orders with doorstep delivery verification.
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    value="upi_netbanking"
                    control={<Radio sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>UPI / Net Banking / Debit Card</Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                          Instant payment via Google Pay, PhonePe, Paytm, or Net Banking.
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    value="credit_card"
                    control={<Radio sx={{ color: '#D4AF37', '&.Mui-checked': { color: '#D4AF37' } }} />}
                    label={
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Credit Card (Visa / Mastercard / Amex)</Typography>
                        <Typography variant="caption" sx={{ color: '#aaa' }}>
                          Encrypted 256-bit SSL transaction with OTP verification.
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={() => setActiveStep(0)}
                startIcon={<ArrowBackIcon />}
                sx={{ color: '#aaa', borderRadius: '2px' }}
              >
                Back to Shipping
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#D4AF37',
                  color: '#000',
                  borderRadius: '2px',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { backgroundColor: '#b89428' },
                }}
              >
                Review Order
              </Button>
            </Box>
          </form>
        );

      case 2:
        return (
          <Box>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 3, mb: 3, backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37' }}>
                    Delivery Destination
                  </Typography>
                  <Typography sx={{ color: '#e0e0e0' }}>
                    {shippingForm.firstName} {shippingForm.lastName}<br />
                    {shippingForm.address}<br />
                    {shippingForm.city}, {shippingForm.state} {shippingForm.postalCode}<br />
                    Phone: {shippingForm.phone}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setActiveStep(0)}
                    sx={{ mt: 1, p: 0, color: '#D4AF37' }}
                  >
                    Edit Shipping
                  </Button>
                </Paper>

                <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37' }}>
                    Selected Payment Mode
                  </Typography>
                  <Typography sx={{ color: '#e0e0e0', textTransform: 'capitalize' }}>
                    {paymentMethodValue.replace(/_/g, ' ')}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setActiveStep(1)}
                    sx={{ mt: 1, p: 0, color: '#D4AF37' }}
                  >
                    Change Method
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#222', borderColor: 'rgba(212,175,55,0.2)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37' }}>
                    Order Summary
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal ({cartItems.length} items)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatInr(subtotal)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Insured Shipping
                      </Typography>
                      <Typography variant="body2" sx={{ color: shippingAmount === 0 ? '#4caf50' : 'inherit' }}>
                        {shippingAmount === 0 ? 'Complimentary' : formatInr(shippingAmount)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        GST (3% Jewelry Tax)
                      </Typography>
                      <Typography variant="body2">
                        {formatInr(taxAmount)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Grand Total
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#D4AF37' }}>
                        {formatInr(total)}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || cartItems.length === 0}
                      onClick={placeOrderHandler}
                      sx={{
                        backgroundColor: '#D4AF37',
                        color: '#000',
                        borderRadius: '2px',
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#b89428' },
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Confirm & Place Order'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: '80vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 400, letterSpacing: '1px' }}>
        Secure Checkout
      </Typography>

      <Box sx={{ width: '100%', mb: 6, mt: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { color: '#aaa', '&.Mui-active': { color: '#D4AF37' }, '&.Mui-completed': { color: '#D4AF37' } } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activeStep === 3 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CheckCircleIcon sx={{ fontSize: 72, mb: 2, color: '#D4AF37' }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 400 }}>
            Order Placed Successfully
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for shopping with Gahana Jewelry. Your order is registered in our fulfillment system.
          </Typography>
          <Typography variant="h6" sx={{ my: 3, color: '#D4AF37', letterSpacing: '1px' }}>
            Order ID: <strong>{placedOrder?.orderNumber || 'ORD-GAH-SUCCESS'}</strong>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/shop')}
            sx={{
              mt: 2,
              backgroundColor: '#D4AF37',
              color: '#000',
              borderRadius: '2px',
              px: 4,
              fontWeight: 600,
              '&:hover': { backgroundColor: '#b89428' },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        renderStepContent(activeStep)
      )}
    </Container>
  );
};

export default CheckoutPage;
