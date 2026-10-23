import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, Favorite } from '@mui/icons-material';
import HeroSlider from '../components/layout/HeroSlider';
import { products as allProducts } from '../data/products';
import { formatInrAsUsd } from '../utils/currency';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    '& .category-image': {
      transform: 'scale(1.03)',
    },
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(1.5),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '10px 28px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  background: 'linear-gradient(45deg, #b78b20 0%, #f5d76e 100%)',
  color: '#fff',
  boxShadow: '0 4px 15px rgba(183, 139, 32, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(183, 139, 32, 0.4)',
    background: 'linear-gradient(45deg, #a67c1c 0%, #e6c95a 100%)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const HomePage = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/shop');
  };

  // Categories Data
  const categories = [
    {
      id: 1,
      name: 'Diamond Rings',
      image: '/images/rings-category.jpg',
      link: '/shop?category=diamond-rings',
    },
    {
      id: 2,
      name: 'Gold Necklaces',
      image: '/images/necklaces-category.jpg',
      link: '/shop?category=gold-necklaces',
    },
    {
      id: 3,
      name: 'Earrings',
      image: '/images/earrings-category.jpg',
      link: '/shop?category=earrings',
    },
    {
      id: 4,
      name: 'Bracelets',
      image: '/images/bracelets-category.jpg',
      link: '/shop?category=bracelets',
    },
  ];

  // Featured Products
  const featuredProducts = allProducts.slice(0, 3);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 6,
            background: 'linear-gradient(45deg, #b78b20 0%, #f5d76e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          Shop by Category
        </Typography>
        
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <CategoryCard>
                <Link to={category.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                    className="category-image"
                    sx={{
                      transition: 'transform 0.3s ease-in-out',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" align="center">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Link>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ backgroundColor: '#1a1a1a', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              mb: 6,
              background: 'linear-gradient(45deg, #b78b20 0%, #f5d76e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Featured Products
          </Typography>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                      {formatInrAsUsd(product.price)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="add to favorites">
                      <Favorite color="error" />
                    </IconButton>
                    <Button 
                      size="small" 
                      variant="contained" 
                      sx={{ ml: 'auto' }}
                      onClick={handleShopNow}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <StyledButton
              variant="contained"
              size="large"
              onClick={handleShopNow}
              startIcon={<ShoppingCart />}
            >
              View All Products
            </StyledButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
