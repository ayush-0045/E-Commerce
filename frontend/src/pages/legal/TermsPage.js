import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6, color: '#e0e0e0' }}>
      <Typography variant="overline" sx={{ color: '#D4AF37', letterSpacing: '2px', fontWeight: 600 }}>
        LEGAL & COMPLIANCE
      </Typography>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 400, color: '#fff' }}>
        Terms and Conditions
      </Typography>
      <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 4 }}>
        Effective Date: October 2026 | Last Updated: October 2026
      </Typography>

      <Paper variant="outlined" sx={{ p: 4, backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          1. Authenticity & Hallmarking
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          Every piece of gold jewelry sold on Gahana Jewelry is 100% certified with the Bureau of Indian Standards (BIS) Hallmark. Diamonds above 0.30 carat are accompanied by a physical certificate from accredited gemological laboratories (IGI, GIA, or SGL).
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          2. Transparent Bullion Pricing
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          Jewelry prices are computed transparently based on:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 1, fontSize: '0.875rem' } }}>
          <li>Net precious metal weight in grams multiplied by applicable purity rate (24K, 22K, 18K, 14K, 92.5 Silver).</li>
          <li>Making charges corresponding to the artisanal complexity of the design.</li>
          <li>Applicable 3% Goods and Services Tax (GST) mandated by Indian law.</li>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          3. Shipping, Insurance & Delivery
        </Typography>
        <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
          All domestic consignments are fully insured until delivered to the authorized recipient. Doorstep deliveries require physical identity verification. Orders valued above ₹50,000 include complimentary insured transit.
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', fontWeight: 500 }}>
          4. 15-Day Exchange & Lifetime Buyback
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
          Customers enjoy a 15-day return and exchange policy on unworn jewelry with security tags intact. We also offer lifetime buyback and gold exchange at prevailing market bullion values.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsPage;
