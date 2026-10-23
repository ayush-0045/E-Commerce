import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { saveShippingAddress, savePaymentMethod } from '../features/cart/cartSlice';

const steps = ['Shipping', 'Payment', 'Place Order'];

const CheckoutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingForm, setShippingForm] = useState({
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || '',
  });
  const [paymentMethodValue, setPaymentMethodValue] = useState(paymentMethod || 'PayPal');
  const [saveAddress, setSaveAddress] = useState(true);
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({
      ...shippingForm,
      saveToProfile: saveAddress
    }));
    setActiveStep(1);
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodValue));
    setActiveStep(2);
  };
  
  const placeOrderHandler = () => {
    // In a real app, you would create an order here
    console.log('Order placed!');
    // navigate('/order/123');
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleShippingSubmit}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            {!userInfo && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Already have an account? <a href="/login" style={{ color: 'inherit' }}>Sign in</a> for a faster checkout.
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First name"
                  value={userInfo?.name?.split(' ')[0] || ''}
                  disabled={!!userInfo}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  value={userInfo?.name?.split(' ')[1] || ''}
                  disabled={!!userInfo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email address"
                  type="email"
                  value={userInfo?.email || ''}
                  disabled={!!userInfo}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  name="address"
                  label="Address line"
                  value={shippingForm.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="postalCode"
                  name="postalCode"
                  label="Postal code"
                  value={shippingForm.postalCode}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  name="country"
                  label="Country/Region"
                  value={shippingForm.country}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone number (optional)"
                />
              </Grid>
              {!userInfo && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        color="primary" 
                        checked={saveAddress} 
                        onChange={(e) => setSaveAddress(e.target.checked)} 
                      />
                    }
                    label="Create an account for faster checkout next time"
                  />
                </Grid>
              )}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
              >
                Continue to Payment
              </Button>
            </Box>
          </form>
        );
      
      case 1:
        return (
          <form onSubmit={handlePaymentSubmit}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="payment method"
                  name="paymentMethod"
                  value={paymentMethodValue}
                  onChange={(e) => setPaymentMethodValue(e.target.value)}
                >
                  <FormControlLabel
                    value="PayPal"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src="/images/paypal.png" 
                          alt="PayPal" 
                          style={{ height: 24, marginRight: 8 }} 
                        />
                        <span>PayPal</span>
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="CreditCard"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                          <img 
                            src="/images/visa.png" 
                            alt="Visa" 
                            style={{ height: 16 }} 
                          />
                          <img 
                            src="/images/mastercard.png" 
                            alt="Mastercard" 
                            style={{ height: 16 }} 
                          />
                          <img 
                            src="/images/amex.png" 
                            alt="American Express" 
                            style={{ height: 16 }} 
                          />
                        </Box>
                        <span>Credit or Debit Card</span>
                      </Box>
                    }
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    value="ApplePay"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src="/images/apple-pay.png" 
                          alt="Apple Pay" 
                          style={{ height: 24, marginRight: 8 }} 
                        />
                        <span>Apple Pay</span>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
              
              {paymentMethodValue === 'CreditCard' && (
                <Box sx={{ mt: 3, pl: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="cardNumber"
                        name="cardNumber"
                        label="Card number"
                        placeholder="1234 5678 9012 3456"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="cardName"
                        name="cardName"
                        label="Name on card"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="expDate"
                        name="expDate"
                        label="Expiry date"
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="cvv"
                        name="cvv"
                        label="CVV"
                        type="password"
                        placeholder="•••"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox color="primary" defaultChecked />}
                        label="Save card for future purchases"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={() => setActiveStep(0)}
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none' }}
              >
                Back to Shipping
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
              >
                Review Order
              </Button>
            </Box>
          </form>
        );
      
      case 2:
        return (
          <Box>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Review Your Order
              </Typography>
              <Typography color="text.secondary" paragraph>
                Please review your order details before placing your order.
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Information
                  </Typography>
                  <Typography>
                    {userInfo?.name || 'John Doe'}<br />
                    {shippingForm.address}<br />
                    {shippingForm.city}, {shippingForm.postalCode}<br />
                    {shippingForm.country}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setActiveStep(0)}
                    sx={{ mt: 1, p: 0, textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography>
                    {paymentMethodValue === 'PayPal' && 'PayPal'}
                    {paymentMethodValue === 'CreditCard' && 'Credit or Debit Card ending in 4242'}
                    {paymentMethodValue === 'ApplePay' && 'Apple Pay'}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => setActiveStep(1)}
                    sx={{ mt: 1, p: 0, textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal (3 items)
                      </Typography>
                      <Typography variant="body2">
                        $1,799.97
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping
                      </Typography>
                      <Typography variant="body2">
                        Free
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tax
                      </Typography>
                      <Typography variant="body2">
                        $143.99
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        $1,943.96
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </Typography>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={placeOrderHandler}
                      sx={{ mt: 3, py: 1.5 }}
                    >
                      Place Order
                    </Button>
                    
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img 
                        src="/images/secure-checkout.png" 
                        alt="Secure Checkout" 
                        style={{ height: 24, margin: '0 auto' }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Secure SSL Encryption
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      <Box sx={{ width: '100%', mb: 6 }}>
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>
                  {isMobile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {index === 0 && <ShippingIcon sx={{ mr: 1 }} />}
                      {index === 1 && <PaymentIcon sx={{ mr: 1 }} />}
                      {index === 2 && <CheckCircleIcon sx={{ mr: 1 }} />}
                      {label}
                    </Box>
                  ) : (
                    label
                  )}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      
      <Box>
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              Thank You for Your Order!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your order has been placed and is being processed. You will receive an email confirmation shortly.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Order #: <strong>GAH-{Math.floor(100000 + Math.random() * 900000)}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Box>
            {renderStepContent(activeStep)}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;
