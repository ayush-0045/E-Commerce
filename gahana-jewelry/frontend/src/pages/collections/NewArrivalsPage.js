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

const NewArrivalsPage = () => {
  const navigate = useNavigate();
  const newArrivals = sampleProducts.filter(product => product.isNew);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            New Arrivals
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover our latest collection of exquisite jewelry pieces
          </Typography>
        </Box>

        {newArrivals.length > 0 ? (
          <Grid container spacing={4}>
            {newArrivals.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
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
              No new arrivals at the moment. Please check back soon!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewArrivalsPage;
