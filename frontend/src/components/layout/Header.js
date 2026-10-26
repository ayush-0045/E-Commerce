import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Drawer, List, ListItem, ListItemText, Divider, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { ShoppingCart, Menu as MenuIcon, Person, ExitToApp, Dashboard } from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';
import { selectCartItemsCount } from '../../features/cart/cartSlice';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userLogin = useSelector((state) => state.auth);
  const { userInfo } = userLogin;
  const isAdmin = Boolean(userInfo?.isAdmin || userInfo?.role === 'admin');
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user info from local storage immediately
    localStorage.removeItem('userInfo');
    
    // Dispatch logout action
    dispatch(logout());
    
    // Close the menu
    handleMenuClose();
    
    // Force redirect to login page
    window.location.href = '/login';
  };

  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userInfo ? (
        [
          <MenuItem key="profile" onClick={() => { handleMenuClose(); navigate('/account'); }}>
            <Person sx={{ mr: 1 }} /> My Profile
          </MenuItem>,
          isAdmin && (
            <MenuItem key="dashboard" onClick={() => { handleMenuClose(); navigate('/admin/dashboard'); }}>
              <Dashboard sx={{ mr: 1 }} /> Admin Analytics
            </MenuItem>
          ),
          isAdmin && (
            <MenuItem key="orders" onClick={() => { handleMenuClose(); navigate('/admin/orders'); }}>
              <ShoppingCart sx={{ mr: 1 }} /> Manage Orders
            </MenuItem>
          ),
          <Divider key="divider" />,
          <MenuItem key="logout" onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} /> Logout
          </MenuItem>
        ]
      ) : (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>
          <Person sx={{ mr: 1 }} /> Sign In
        </MenuItem>
      )}
    </Menu>
  );

  const drawer = (
    <div>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/shop">
          <ListItemText primary="Shop" />
        </ListItem>
        <ListItem button component={Link} to="/cart">
          <ListItemText primary={`Cart (${cartItemsCount})`} />
        </ListItem>
        {userInfo && (
          <ListItem button component={Link} to="/account">
            <ListItemText primary="My Account" />
          </ListItem>
        )}
        {isAdmin && (
          <>
            <ListItem button component={Link} to="/admin/dashboard">
              <ListItemText primary="Admin Analytics" />
            </ListItem>
            <ListItem button component={Link} to="/admin/orders">
              <ListItemText primary="Admin Orders" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#dca009',
        color: '#ffffff',
        '& .MuiButton-text': {
          color: '#ffffff',
          '&:hover': {
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }
        },
        '& .MuiSvgIcon-root': {
          color: '#ffffff'
        },
        '& .MuiTypography-root': {
          color: '#ffffff'
        }
      }}>
        {/* Luxury Bullion Spot Rate Ticker Bar */}
        <Box sx={{ 
          backgroundColor: '#8b6914', 
          color: '#fdfbf7', 
          py: 0.4, 
          px: 2, 
          display: { xs: 'none', sm: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.15)'
        }}>
          <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.03em' }}>
            Live Bullion Benchmark: 24K Gold ₹7,350/g | 22K Gold ₹6,740/g | 18K Gold ₹5,510/g | Silver 925 ₹88/g
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.03em' }}>
            BIS Hallmark Certified • 100% Insured Delivery Across India
          </Typography>
        </Box>

        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            GAHANA JEWELRY
          </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button 
              component={Link} 
              to="/shop"
              sx={{ 
                color: '#ffffff',
                fontWeight: 600,
                '&:hover': {
                  color: '#000000',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Shop
            </Button>
            {isAdmin && (
              <Button
                component={Link}
                to="/admin/dashboard"
                variant="outlined"
                size="small"
                sx={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.7)',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  ml: 1,
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }
                }}
              >
                Admin Panel
              </Button>
            )}
            <IconButton color="inherit" component={Link} to="/cart" sx={{ ml: 1 }}>
              <Badge badgeContent={cartItemsCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <Person />}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {renderMenu}
      <Toolbar /> {/* This is needed to push content below the fixed AppBar */}
    </Box>
  );
};

export default Header;
