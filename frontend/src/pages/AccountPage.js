import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Payment as PaymentIcon,
  LocationOn as AddressIcon
} from '@mui/icons-material';
import { logout, updateUserProfile } from '../features/auth/authSlice';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addresses] = useState([
    {
      id: 1,
      type: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ]);
  const [orders] = useState([
    {
      id: 'GAH-123456',
      date: '2023-10-15',
      status: 'Delivered',
      itemCount: 2,
      total: 1299.98,
      items: [
        { id: 1, name: 'Diamond Solitaire Ring', price: 899.99, quantity: 1, image: '/images/diamond-ring.jpg' },
        { id: 2, name: 'Gold Plated Necklace', price: 399.99, quantity: 1, image: '/images/gold-necklace.jpg' },
      ],
    },
    {
      id: 'GAH-123455',
      date: '2023-09-28',
      status: 'Shipped',
      itemCount: 1,
      total: 249.99,
      items: [
        { id: 3, name: 'Pearl Earrings', price: 249.99, quantity: 1, image: '/images/pearl-earrings.jpg' },
      ],
    },
  ]);
  const [wishlist, setWishlist] = useState([
    { id: 4, name: 'Silver Pendant Necklace', price: 179.99, image: '/images/silver-pendant.jpg' },
    { id: 5, name: 'Diamond Tennis Bracelet', price: 1299.99, image: '/images/tennis-bracelet.jpg' },
  ]);
  
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(profileForm));
    setEditMode(false);
    // Show success message
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    // Show success message
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  
  const handleRemoveFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };
  
  const handleAddToCart = (product) => {
    // Add to cart logic
    // dispatch(addToCart({ ...product, qty: 1 }));
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>
      
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2 }}>
              <Avatar 
                src={userInfo?.avatar} 
                alt={userInfo?.name} 
                sx={{ width: 64, height: 64, mr: 2 }}
              >
                {userInfo?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {userInfo?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo?.email}
                </Typography>
              </Box>
            </Box>
            
            <List component="nav" sx={{ '& .MuiListItemButton-root': { borderRadius: 1 } }}>
              <ListItem 
                button 
                selected={tabValue === 0}
                onClick={() => setTabValue(0)}
              >
                <PersonIcon sx={{ mr: 1.5, color: tabValue === 0 ? 'primary.main' : 'inherit' }} />
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 1}
                onClick={() => setTabValue(1)}
              >
                <OrdersIcon sx={{ mr: 1.5, color: tabValue === 1 ? 'primary.main' : 'inherit' }} />
                <ListItemText primary="My Orders" />
                <Chip label={orders.length} size="small" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 2}
                onClick={() => setTabValue(2)}
              >
                <WishlistIcon sx={{ mr: 1.5, color: tabValue === 2 ? 'primary.main' : 'inherit' }} />
                <ListItemText primary="Wishlist" />
                <Chip label={wishlist.length} size="small" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 3}
                onClick={() => setTabValue(3)}
              >
                <AddressIcon sx={{ mr: 1.5, color: tabValue === 3 ? 'primary.main' : 'inherit' }} />
                <ListItemText primary="Addresses" />
              </ListItem>
              
              <ListItem 
                button 
                selected={tabValue === 4}
                onClick={() => setTabValue(4)}
              >
                <PaymentIcon sx={{ mr: 1.5, color: tabValue === 4 ? 'primary.main' : 'inherit' }} />
                <ListItemText primary="Payment Methods" />
              </ListItem>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem button onClick={handleLogout}>
                <OrdersIcon sx={{ mr: 1 }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, minHeight: '60vh' }}>
            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {!editMode ? (
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => setEditMode(false)}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={handleProfileSubmit}
                      startIcon={<CheckIcon />}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Profile Photo</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={userInfo?.avatar} 
                        alt={userInfo?.name} 
                        sx={{ width: 100, height: 100, mr: 3 }}
                      >
                        {userInfo?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Button variant="outlined" component="label" size="small" disabled={!editMode}>
                          Upload New Photo
                          <input type="file" hidden />
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                          JPG, GIF or PNG. Max size of 2MB
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom>Change Password</Typography>
                    <form onSubmit={handlePasswordSubmit}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        sx={{ mb: 2 }}
                      />
                      <Button 
                        type="submit" 
                        variant="contained"
                        disabled={
                          !passwordForm.currentPassword || 
                          !passwordForm.newPassword || 
                          passwordForm.newPassword !== passwordForm.confirmPassword ||
                          passwordForm.newPassword.length < 6
                        }
                      >
                        Update Password
                      </Button>
                    </form>
                  </Box>
                  
                  <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" gutterBottom>Account Actions</Typography>
                    <Button 
                      variant="outlined" 
                      color="error"
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Delete Account
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Permanently delete your account and all associated data.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Order History</Typography>
              
              {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <OrdersIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>No Orders Yet</Typography>
                  <Typography color="text.secondary" paragraph>
                    You haven't placed any orders yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/shop')}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <Box>
                  {orders.map((order) => (
                    <Paper key={order.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2">Order #{order.id}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Box>
                          <Chip 
                            label={order.status}
                            color={
                              order.status === 'Delivered' ? 'success' : 
                              order.status === 'Shipped' ? 'info' : 
                              order.status === 'Processing' ? 'warning' : 'default'
                            }
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        {order.items.slice(0, 3).map((item) => (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Box sx={{ display: 'flex' }}>
                              <Box 
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.quantity}
                                </Typography>
                                <Typography variant="body2" color="primary" fontWeight="medium">
                                  ${item.price.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} • Total: 
                          <Typography component="span" color="primary" fontWeight="bold">
                            {' '}${order.total.toFixed(2)}
                          </Typography>
                        </Typography>
                        
                        <Box>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ mr: 1 }}
                            disabled={order.status !== 'Delivered'}
                          >
                            Track Package
                          </Button>
                          <Button 
                            variant="contained" 
                            size="small"
                            disabled={order.status === 'Cancelled'}
                          >
                            Buy Again
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </TabPanel>
            
            {/* Wishlist Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">My Wishlist</Typography>
                <Typography variant="body2" color="text.secondary">
                  {wishlist.length} items
                </Typography>
              </Box>
              
              {wishlist.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <FavoriteBorderIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Your Wishlist is Empty</Typography>
                  <Typography color="text.secondary" paragraph>
                    Save items you love for easy access later.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/shop')}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {wishlist.map((item) => (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ position: 'relative', pt: '100%', mb: 2 }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          <IconButton 
                            size="small" 
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8, 
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'background.paper' } 
                            }}
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="subtitle2" noWrap title={item.name}>
                          {item.name}
                        </Typography>
                        <Typography variant="body1" color="primary" fontWeight="bold" sx={{ mt: 'auto', pt: 1 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                        
                        <Button 
                          variant="contained" 
                          size="small" 
                          fullWidth 
                          sx={{ mt: 2 }}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            {/* Addresses Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">My Addresses</Typography>
                <Button variant="contained" size="small">
                  Add New Address
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {addresses.map((address) => (
                  <Grid item xs={12} md={6} key={address.id}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, 
                        height: '100%',
                        borderColor: address.isDefault ? 'primary.main' : 'divider',
                        position: 'relative'
                      }}
                    >
                      {address.isDefault && (
                        <Chip 
                          label="Default" 
                          size="small" 
                          color="primary" 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            borderRadius: 1
                          }} 
                        />
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom>
                        {address.type}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<EditIcon fontSize="small" />}
                        >
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            color="primary"
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="error"
                          sx={{ ml: 'auto' }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            
            {/* Payment Methods Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Payment Methods</Typography>
                <Button variant="contained" size="small">
                  Add New Card
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/images/visa.png" 
                      alt="Visa" 
                      style={{ height: 24, marginRight: 12 }} 
                    />
                    <Box>
                      <Typography variant="subtitle1">Visa ending in 4242</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires 04/2025
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<EditIcon fontSize="small" />}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      color="error"
                      startIcon={<CloseIcon fontSize="small" />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Set as default payment method"
                />
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/images/paypal.png" 
                      alt="PayPal" 
                      style={{ height: 24, marginRight: 12 }} 
                    />
                    <Box>
                      <Typography variant="subtitle1">PayPal</Typography>
                      <Typography variant="body2" color="text.secondary">
                        user@example.com
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<EditIcon fontSize="small" />}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      color="error"
                      startIcon={<CloseIcon fontSize="small" />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Paper>
              
              <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" gutterBottom>Billing Address</Typography>
                <Typography variant="body2" paragraph>
                  Same as shipping address<br />
                  123 Main St<br />
                  New York, NY 10001<br />
                  United States
                </Typography>
                <Button variant="outlined" size="small">
                  Edit Billing Address
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountPage;
