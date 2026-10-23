import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Button, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import { products } from '../../data/products';
import { formatInrAsUsd } from '../../utils/currency';
// Sample product data with correct image paths
const sampleProducts = products;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const LimitedEditionPage = () => {
  const navigate = useNavigate();
  const limitedEdition = sampleProducts.filter(product => product.isLimitedEdition);

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f5f0' }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Limited Edition
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Exclusive pieces for the discerning few
          </Typography>
        </Box>

        {limitedEdition.length > 0 ? (
          <Grid container spacing={4}>
            {limitedEdition.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  {product.isNew && (
                    <Box
                      position="absolute"
                      top={10}
                      right={10}
                      bgcolor="error.main"
                      color="white"
                      px={1.5}
                      py={0.5}
                      borderRadius={1}
                      zIndex={1}
                    >
                      <Typography variant="caption" fontWeight="bold">
                        NEW
                      </Typography>
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {formatInrAsUsd(product.price)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No limited edition items available at the moment.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LimitedEditionPage;
