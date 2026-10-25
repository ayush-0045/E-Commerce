import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Grid,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { removeFromCart, updateCartItemQty } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import { formatInr } from '../utils/currency';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };
  
  const updateCartHandler = (item, qty) => {
    if (qty > 0 && qty <= item.countInStock) {
      dispatch(updateCartItemQty({ id: item.product, qty }));
    } else if (qty > item.countInStock) {
      toast.error(`Only ${item.countInStock} available in stock`);
    }
  };
  
  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            component={RouterLink}
            to="/shop"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {isMobile ? (
              <Box>
                {cartItems.map((item) => (
                  <Box key={item.product} sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box 
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Link 
                          component={RouterLink} 
                          to={`/product/${item.product}`}
                          color="inherit"
                          underline="hover"
                        >
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary">
                          {item.metalType} • Size: {item.size || 'N/A'}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          {formatInr(Number(item?.price) || 0)}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => removeFromCartHandler(item.product)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateCartHandler(item, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.qty}
                          onChange={(e) => updateCartHandler(item, Number(e.target.value))}
                          type="number"
                          size="small"
                          inputProps={{ min: 1, max: item.countInStock, style: { textAlign: 'center', width: 40, padding: '8px 0' } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: 'none' },
                              '&:hover fieldset': { border: 'none' },
                              '&.Mui-focused fieldset': { border: 'none' },
                            },
                            '& input[type=number]': {
                              '-moz-appearance': 'textfield',
                            },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              '-webkit-appearance': 'none',
                              margin: 0,
                            },
                            width: 60,
                          }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => updateCartHandler(item, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle1" fontWeight="medium">
                        {formatInr((Number(item?.price) || 0) * (Number(item?.qty) || 0))}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box 
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                            />
                            <Box>
                              <Link 
                                component={RouterLink} 
                                to={`/product/${item.product}`}
                                color="inherit"
                                underline="hover"
                              >
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {item.name}
                                </Typography>
                              </Link>
                              <Typography variant="body2" color="text.secondary">
                                {item.metalType} • Size: {item.size || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {formatInr(Number(item?.price) || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateCartHandler(item, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.qty}
                              onChange={(e) => updateCartHandler(item, Number(e.target.value))}
                              type="number"
                              size="small"
                              inputProps={{ 
                                min: 1, 
                                max: item.countInStock, 
                                style: { textAlign: 'center', width: 40, padding: '8px 0' } 
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { border: 'none' },
                                  '&:hover fieldset': { border: 'none' },
                                  '&.Mui-focused fieldset': { border: 'none' },
                                },
                                '& input[type=number]': {
                                  '-moz-appearance': 'textfield',
                                },
                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                  '-webkit-appearance': 'none',
                                  margin: 0,
                                },
                                width: 60,
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => updateCartHandler(item, item.qty + 1)}
                              disabled={item.qty >= item.countInStock}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          {item.qty > item.countInStock && (
                            <Typography variant="caption" color="error">
                              Only {item.countInStock} available
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            {formatInr((Number(item?.price) || 0) * (Number(item?.qty) || 0))}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => removeFromCartHandler(item.product)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                component={RouterLink}
                to="/shop"
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none' }}
              >
                Continue Shopping
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // Clear cart logic would go here
                  toast.success('Cart cleared');
                }}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>
          
          {/* Gift Options */}
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Gift Options
            </Typography>
            <FormControlLabel
              control={<Checkbox />}
              label="This is a gift"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Gift Message (Optional)"
                fullWidth
                multiline
                rows={3}
                placeholder="Add a personal message..."
                variant="outlined"
                size="small"
              />
              <Button variant="outlined" sx={{ alignSelf: 'flex-start' }}>
                Add
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                </Typography>
                <Typography variant="body2">
                  {formatInr(Number(itemsPrice) || 0)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {(!shippingPrice || shippingPrice === 0)
                    ? 'Free'
                    : formatInr(Number(shippingPrice) || 0)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax (estimated)
                </Typography>
                <Typography variant="body2">
                  {formatInr(Number(taxPrice) || 0)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Order Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatInr(Number(totalPrice) || 0)}
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                sx={{ py: 1.5, mb: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center">
                or{' '}
                <Link 
                  component={RouterLink} 
                  to="/shop" 
                  underline="hover"
                  color="primary"
                >
                  Continue Shopping
                </Link>
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Secure Checkout
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {['visa', 'mastercard', 'amex', 'paypal', 'apple-pay'].map((type) => (
                  <Box 
                    key={type}
                    component="img"
                    src={`/images/payment-${type}.png`}
                    alt={type}
                    sx={{ height: 24, width: 'auto' }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Your payment information is processed securely. We do not store credit card details.
              </Typography>
            </Box>
          </Paper>
          
          {/* Promo Code */}
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Have a Promo Code?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Enter promo code"
                variant="outlined"
                size="small"
                fullWidth
              />
              <Button variant="outlined">
                Apply
              </Button>
            </Box>
          </Paper>
          
          {/* Need Help? */}
          <Box sx={{ mt: 3, p: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our customer service team is available to assist you with any questions about your order.
            </Typography>
            <Button 
              variant="text" 
              size="small" 
              component={RouterLink}
              to="/contact"
              sx={{ p: 0, textTransform: 'none' }}
            >
              Contact Us
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
