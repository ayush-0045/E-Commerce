import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Typography, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, Pinterest, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid',
        borderColor: '#333',
        mt: 'auto',
        pt: 6,
        pb: 4,
        color: '#fff'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Us */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="#dca009" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="#b0b0b0" paragraph>
              Gehana Jewelry brings you the finest collection of handcrafted jewelry, 
              made with love and precision to last a lifetime.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <Instagram />
              </Link>
              <Link href="#" color="inherit">
                <Pinterest />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn />
              </Link>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" color="#dca009" gutterBottom>
              Shop
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/shop?category=rings" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/shop?category=necklaces" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/shop?category=earrings" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  Earrings
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/shop?category=bracelets" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                >
                  Bracelets
                </Link>
              </li>
            </Box>
          </Grid>
          
          {/* Customer Service */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" color="#dca009" gutterBottom>
              Customer Service
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/contact" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/faq" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/shipping" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                  mb={1}
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  component={RouterLink} 
                  to="/size-guide" 
                  color="#b0b0b0" 
                  underline="hover"
                  display="block"
                >
                  Size Guide
                </Link>
              </li>
            </Box>
          </Grid>
          
          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={5}>
            <Typography variant="h6" color="#dca009" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="#b0b0b0" paragraph>
              Have questions? We're here to help!
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="#b0b0b0" paragraph>
                Email: concierge@gahanajewelry.com
              </Typography>
              <Typography variant="body2" color="#b0b0b0" paragraph>
                Phone: +91 22 2640 1234 / +91 98200 12345
              </Typography>
              <Typography variant="body2" color="#b0b0b0" paragraph>
                Flagship Atelier: Linking Road, Bandra West, Mumbai, MH 400050
              </Typography>
            </Box>
            <Typography variant="body2" color="#b0b0b0">
              Hours: Mon - Sat 10:30 AM - 8:30 PM IST
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2" color="#ffffff">
              © {currentYear} Gehana Jewelry. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link 
                component={RouterLink} 
                to="/privacy-policy" 
                color="#ffffff" 
                variant="body2"
                underline="hover"
                sx={{ '&:hover': { color: '#dca009' } }}
              >
                Privacy Policy
              </Link>
              <Link 
                component={RouterLink} 
                to="/terms" 
                color="#ffffff" 
                variant="body2"
                underline="hover"
                sx={{ '&:hover': { color: '#dca009' } }}
              >
                Terms of Service
              </Link>
              <Link 
                component={RouterLink} 
                to="/sitemap" 
                color="#ffffff" 
                variant="body2"
                underline="hover"
                sx={{ '&:hover': { color: '#dca009' } }}
              >
                Sitemap
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
