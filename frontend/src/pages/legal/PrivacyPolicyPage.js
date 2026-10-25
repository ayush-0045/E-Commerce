import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6, color: '#e0e0e0' }}>
      <Typography variant="overline" sx={{ color: '#D4AF37', letterSpacing: '2px', fontWeight: 600 }}>
        LEGAL & COMPLIANCE
      </Typography>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 400, color: '#fff' }}>
        Privacy Policy
      </Typography>
      <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 4 }}>
        Effective Date: October 2026 | Last Updated: October 2026
      </Typography>

      <Paper variant="outlined" sx={{ p: 4, backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          1. Information We Collect
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          Gahana Jewelry collects personal details necessary to fulfill high-value precious jewelry orders. This includes full name, residential shipping address, contact phone number, email address, and billing particulars. Payment credentials (credit/debit card numbers or UPI identifiers) are processed directly by certified RBI-compliant banking gateways and are never stored on our servers.
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          2. Purpose of Data Processing
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          Your data is used strictly for:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 1, fontSize: '0.875rem' } }}>
          <li>Verification of BIS Hallmarking certification and delivery insurance coverage.</li>
          <li>Real-time shipment tracking with verified courier partners (BlueDart / Delhivery Express).</li>
          <li>Customer support, GST invoice generation, and product authenticity documentation.</li>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          3. Security Measures
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          All customer sessions are protected by 256-bit Secure Socket Layer (SSL) encryption. Administrative access to customer order histories requires role-based authentication and is logged for auditing purposes.
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          4. Contact Our Privacy Office
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          For queries regarding your personal data or to request account deletion, contact our Grievance Officer at: <strong>privacy@gahanajewelry.com</strong>.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
