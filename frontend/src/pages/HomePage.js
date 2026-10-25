import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, FavoriteBorder, VerifiedOutlined } from '@mui/icons-material';
import HeroSlider from '../components/layout/HeroSlider';
import { products as allProducts } from '../data/products';
import { formatInr } from '../utils/currency';
import { addToCart } from '../features/cart/cartSlice';

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '2px',
  overflow: 'hidden',
  backgroundColor: '#242424',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  transition: 'transform 0.25s ease, border-color 0.25s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: '#D4AF37',
    '& .category-image': {
      transform: 'scale(1.03)',
    },
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '2px',
  backgroundColor: '#242424',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  cursor: 'pointer',
  transition: 'border-color 0.25s ease, transform 0.25s ease',
  '&:hover': {
    borderColor: '#D4AF37',
    transform: 'translateY(-2px)',
  },
}));

const LuxuryButton = styled(Button)(({ theme }) => ({
  borderRadius: '2px',
  padding: '12px 32px',
  fontWeight: 600,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  fontSize: '0.875rem',
  backgroundColor: '#D4AF37',
  color: '#000',
  border: '1px solid #D4AF37',
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: '#b89428',
    borderColor: '#b89428',
  },
}));

const TrustBanner = styled(Box)(({ theme }) => ({
  borderTop: '1px solid rgba(212, 175, 55, 0.2)',
  borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
  padding: '24px 0',
  backgroundColor: '#161616',
}));

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(addToCart({
      product: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    }));
  };

  const categories = [
    {
      id: 1,
      name: 'Rings',
      subtitle: 'Solitaire & Band Designs',
      image: '/images/rings-category.jpg',
      link: '/shop?category=Rings',
    },
    {
      id: 2,
      name: 'Necklaces',
      subtitle: '22K & 18K Hallmarked',
      image: '/images/necklaces-category.jpg',
      link: '/shop?category=Necklaces',
    },
    {
      id: 3,
      name: 'Earrings',
      subtitle: 'Studs, Jhumkas & Drops',
      image: '/images/earrings-category.jpg',
      link: '/shop?category=Earrings',
    },
    {
      id: 4,
      name: 'Bracelets',
      subtitle: 'Tennis & Chain Styles',
      image: '/images/bracelets-category.jpg',
      link: '/shop?category=Bracelets',
    },
  ];

  const featuredProducts = allProducts.slice(0, 3);

  return (
    <Box sx={{ overflowX: 'hidden', backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      {/* Hero Banner */}
      <HeroSlider />

      {/* Trust & Quality Indicators */}
      <TrustBanner>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#D4AF37', letterSpacing: '0.5px' }}>
                100% BIS HALLMARKED
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Govt. Certified Purity
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#D4AF37', letterSpacing: '0.5px' }}>
                CERTIFIED DIAMONDS
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                IGI & SGL Authenticated
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#D4AF37', letterSpacing: '0.5px' }}>
                INSURED SHIPPING
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Secure Pan-India Delivery
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#D4AF37', letterSpacing: '0.5px' }}>
                TRANSPARENT PRICING
              </Typography>
              <Typography variant="caption" sx={{ color: '#aaa' }}>
                Weight & Gold Breakdowns
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </TrustBanner>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: '3px', color: '#D4AF37', fontWeight: 600 }}
          >
            DISCOVER THE COLLECTIONS
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ fontWeight: 400, mt: 1, letterSpacing: '1px' }}
          >
            Shop by Category
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <CategoryCard>
                <Link to={category.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={category.image}
                    alt={category.name}
                    className="category-image"
                    sx={{
                      transition: 'transform 0.3s ease',
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#aaa', mt: 0.5, display: 'block' }}>
                      {category.subtitle}
                    </Typography>
                  </CardContent>
                </Link>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ backgroundColor: '#141414', py: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: '3px', color: '#D4AF37', fontWeight: 600 }}
            >
              HANDCRAFTED FINE JEWELRY
            </Typography>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ fontWeight: 400, mt: 1, letterSpacing: '1px' }}
            >
              Featured Creations
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <ProductCard onClick={() => navigate(`/product/${product.id}`)}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      size="small"
                      icon={<VerifiedOutlined sx={{ fontSize: '14px !important', color: '#000' }} />}
                      label={product.metalPurity || 'BIS Hallmarked'}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: '#D4AF37',
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '2px',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 2.5 }}>
                    <Typography variant="caption" sx={{ color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {product.metalType} • {product.category}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5, gap: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#D4AF37' }}>
                        {formatInr(product.price)}
                      </Typography>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Typography variant="body2" sx={{ color: '#777', textDecoration: 'line-through' }}>
                          {formatInr(product.originalPrice)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <IconButton 
                      aria-label="Save to Wishlist" 
                      onClick={(e) => { e.stopPropagation(); }}
                      sx={{ color: '#888', '&:hover': { color: '#D4AF37' } }}
                    >
                      <FavoriteBorder fontSize="small" />
                    </IconButton>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      sx={{ 
                        ml: 'auto',
                        borderRadius: '2px',
                        borderColor: '#D4AF37',
                        color: '#D4AF37',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        '&:hover': {
                          borderColor: '#fff',
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          color: '#fff',
                        }
                      }}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 7, textAlign: 'center' }}>
            <LuxuryButton
              variant="contained"
              size="large"
              onClick={() => navigate('/shop')}
              startIcon={<ShoppingCart />}
            >
              Explore Complete Collection
            </LuxuryButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
