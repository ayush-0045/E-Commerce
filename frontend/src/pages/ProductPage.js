import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { products } from '../data/products';
import { formatInr } from '../utils/currency';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Divider,
  IconButton,
  Rating,
  Tabs,
  Tab,
  TextField,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  AddShoppingCart as AddShoppingCartIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { addToCart } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

const StyledImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'opacity 0.3s',
  objectFit: 'cover',
  '&:hover': {
    opacity: 0.8,
  },
  '&[src*="placeholder"]': {
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
});

const ThumbnailContainer = styled(Box)({
  display: 'flex',
  gap: 8,
  marginTop: 8,
  overflowX: 'auto',
  paddingBottom: 8,
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
  },
});

const Thumbnail = styled('img')(({ selected }) => ({
  width: 70,
  height: 70,
  borderRadius: 4,
  border: selected ? '2px solid #b78b20' : '1px solid #e0e0e0',
  cursor: 'pointer',
  opacity: selected ? 1 : 0.7,
  transition: 'all 0.3s',
  '&:hover': {
    opacity: 1,
  },
}));

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [size, setSize] = useState('15');
  const [similarProducts, setSimilarProducts] = useState([]);

  // Compute attribute similarity embedding for recommendations
  const computeSimilarity = (itemA, itemB) => {
    const catScore = itemA.category === itemB.category ? 0.35 : 0.05;
    const metalScore = (itemA.metalType && itemB.metalType && itemA.metalType === itemB.metalType) ? 0.25 : 0.05;
    const gemScore = (itemA.gemstone && itemB.gemstone && itemA.gemstone === itemB.gemstone) ? 0.25 : 0.05;
    const priceDiff = Math.abs((itemA.price || 0) - (itemB.price || 0)) / Math.max(itemA.price || 1, itemB.price || 1);
    const priceScore = Math.max(0, 0.15 * (1 - priceDiff));
    return Math.min(0.99, Number((catScore + metalScore + gemScore + priceScore).toFixed(2)));
  };
  
  // Find product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = parseInt(id, 10);
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          // Function to handle image paths
          const getImagePath = (imgPath) => {
            if (!imgPath) return '/images/placeholder.jpg';
            // Check if the path already starts with /images/
            if (imgPath.startsWith('/images/')) return imgPath;
            // If it's a relative path, prepend /images/
            return `/images/${imgPath}`;
          };
          
          // Process images array or single image
          let productImages = [];
          if (Array.isArray(foundProduct.images) && foundProduct.images.length > 0) {
            productImages = foundProduct.images.map(img => getImagePath(img));
          } else if (foundProduct.image) {
            productImages = [getImagePath(foundProduct.image)];
          } else {
            productImages = ['/images/placeholder.jpg'];
          }
          
          // Create a product object with all required fields
          const productData = {
            ...foundProduct,
            images: productImages,
            // Ensure originalPrice exists for price display
            originalPrice: foundProduct.originalPrice || foundProduct.price,
            // Ensure stock exists for quantity selector
            stock: foundProduct.stock || 10,
            // Ensure size exists for size selector
            size: foundProduct.size || '6.5',
            // Ensure description and details exist
            description: foundProduct.description || 'No description available.',
            details: foundProduct.details || ['No additional details available.']
          };
          
          setProduct(productData);

          // Fetch AI/ML Vector Recommendations
          try {
            const similarRes = await axios.get(`/api/products/${foundProduct.id}/similar`);
            if (similarRes.data && similarRes.data.similar && similarRes.data.similar.length > 0) {
              setSimilarProducts(similarRes.data.similar);
            } else {
              throw new Error('Fallback to client vector similarity');
            }
          } catch {
            const clientRanked = products
              .filter(p => p.id !== foundProduct.id)
              .map(p => {
                const score = computeSimilarity(foundProduct, p);
                return {
                  ...p,
                  image: p.image ? getImagePath(p.image) : '/images/placeholder.jpg',
                  similarityScore: score,
                  confidencePercent: Math.round(score * 100)
                };
              })
              .sort((a, b) => b.similarityScore - a.similarityScore)
              .slice(0, 4);
            setSimilarProducts(clientRanked);
          }
        } else {
          console.error(`Product with ID ${id} not found`);
          // Redirect to shop page with a message instead of 404
          navigate('/shop', { 
            state: { 
              error: `Product with ID ${id} not found. Showing all available products instead.` 
            } 
          });
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(
      addToCart({
        product: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        countInStock: product.stock,
        qty: quantity,
        size,
      })
    );
    
    toast.success('Item added to cart');
  };
  
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };
  
  const handleIncrement = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!product) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Product not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink 
          component="button" 
          variant="body2" 
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
          Back
        </MuiLink>
        <MuiLink 
          component="button" 
          variant="body2" 
          onClick={() => navigate('/shop')}
        >
          Shop
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <StyledImage 
              src={product.images[selectedImage]} 
              alt={product.name} 
            />
            {product.isNew && (
              <Chip
                label="New Arrival"
                color="primary"
                size="small"
                sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }}
              />
            )}
            {product.isOnSale && (
              <Chip
                label="Sale"
                color="error"
                size="small"
                sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }}
              />
            )}
          </Box>
          
          <ThumbnailContainer>
            {product.images.map((img, index) => (
              <Thumbnail
                key={index}
                src={img}
                alt={`${product.name} - ${index + 1}`}
                selected={selectedImage === index}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </ThumbnailContainer>
        </Grid>
        
        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={product.category} 
              size="small" 
              sx={{ mb: 1 }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewCount} reviews)
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              {product.isOnSale && (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through', display: 'inline', mr: 1 }}
                >
{formatInr(product.originalPrice)}
                </Typography>
              )}
              <Typography variant="h4" color="primary" display="inline" fontWeight="bold">
                {formatInr(product.price)}
              </Typography>
              {product.isOnSale && (
                <Chip 
                  label={`Save ${formatInr(product.originalPrice - product.price)}`} 
                  color="error" 
                  size="small" 
                  sx={{ ml: 1, fontWeight: 'bold' }}
                />
              )}
            </Box>
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Size Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Array.from({length: 11}, (_, i) => (i + 10).toString()).map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? 'contained' : 'outlined'}
                    onClick={() => setSize(s)}
                    sx={{
                      minWidth: 0,
                      width: 45,
                      height: 45,
                      borderRadius: '50%',
                      p: 0,
                      '&.MuiButton-contained': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      },
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </Box>
            </Box>
            
            {/* Quantity Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 120 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  sx={{ minWidth: 32, height: 32 }}
                >
                  -
                </Button>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ 
                    min: 1, 
                    max: product.stock,
                    style: { textAlign: 'center', padding: '8px 0' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      '& input': {
                        textAlign: 'center',
                        padding: '8px',
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderLeft: 'none',
                      borderRight: 'none',
                    },
                    mx: 0.5,
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  sx={{ minWidth: 32, height: 32 }}
                >
                  +
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {product.stock} pieces available
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                sx={{ flex: isMobile ? '1 1 100%' : 'none', py: 1.5 }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<FavoriteBorderIcon />}
                sx={{ flex: isMobile ? '1 1 100%' : 'none', py: 1.5 }}
              >
                Add to Wishlist
              </Button>
              
              <IconButton 
                color="primary" 
                aria-label="share"
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1,
                  ml: isMobile ? 'auto' : 0,
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Free Shipping</strong> on all orders. Delivery within 5-7 business days.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>30-day return policy.</strong> Full refund if not satisfied.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="product details tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Shipping & Returns" />
          <Tab label="Reviews (124)" />
        </Tabs>
        
        <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderTop: 'none', borderRadius: '0 0 4px 4px' }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Product Description</Typography>
              <Typography paragraph>
                {product.description}
              </Typography>
              <Typography paragraph>
                This exquisite {product.name.toLowerCase()} is crafted with precision and attention to detail. 
                The {product.gemstone.toLowerCase()} is carefully selected and hand-set to ensure maximum brilliance and sparkle. 
                The {product.metalType.toLowerCase()} band is polished to a high shine, creating a stunning contrast with the gemstone.
              </Typography>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Grid container spacing={2}>
              {product.specifications.map((spec, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', py: 1 }}>
                    <Typography variant="subtitle2" sx={{ minWidth: 120, color: 'text.secondary' }}>
                      {spec.name}:
                    </Typography>
                    <Typography variant="body1">{spec.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Shipping Information</Typography>
              <Typography paragraph>
                {product.shippingInfo}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Return Policy</Typography>
              <Typography paragraph>
                {product.returnPolicy}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Care Instructions</Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>Remove jewelry before swimming, bathing, or cleaning</li>
                <li>Avoid contact with harsh chemicals, perfumes, and lotions</li>
                <li>Clean with a soft, lint-free cloth after each use</li>
                <li>Store in a soft pouch or jewelry box to prevent scratches</li>
              </Typography>
            </Box>
          )}
          
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 'medium' }}>
                  {product.rating} out of 5
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>
              
              <Button variant="outlined" sx={{ mb: 3 }}>
                Write a Review
              </Button>
              
              {/* Sample Review */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    John D.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    May 15, 2023
                  </Typography>
                </Box>
                <Rating value={5} readOnly size="small" />
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  Absolutely stunning! The ring is even more beautiful in person. The diamond sparkles brilliantly, and the craftsmanship is exceptional.
                </Typography>
              </Paper>
              
              {/* Add more reviews or a 'Load More' button */}
              <Button variant="text" color="primary">
                Load More Reviews
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* AI Vector Recommendation Section */}
      <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
                Similar Creations
              </Typography>
              <Chip
                label="AI Embedding Recommendation"
                size="small"
                sx={{
                  backgroundColor: '#b78b20',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  borderRadius: '2px',
                  height: 24,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Curated using multi-dimensional attribute cosine similarity across metal purity, gemstone profile, carat weight, and BIS hallmarking specs.
            </Typography>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {similarProducts.map((related) => (
            <Grid item xs={12} sm={6} md={3} key={related._id || related.id}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#b78b20',
                    boxShadow: '0 4px 16px rgba(183,139,32,0.12)',
                    transform: 'translateY(-3px)',
                  },
                }}
                onClick={() => {
                  navigate(`/product/${related.id || related._id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {/* Confidence match tag */}
                {related.confidencePercent && (
                  <Chip
                    label={`${related.confidencePercent}% Match`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid #b78b20',
                      color: '#8b6914',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 22,
                      borderRadius: '2px',
                    }}
                  />
                )}

                <Box sx={{ position: 'relative', pt: '100%', mb: 2, backgroundColor: '#fafafa', borderRadius: '2px', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={related.image || related.images?.[0]?.url || related.images?.[0] || `/images/placeholder.jpg`}
                    alt={related.name || `Related product`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                  {related.metalType && (
                    <Chip 
                      label={`${related.metalPurity || ''} ${related.metalType}`.trim()} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: '0.65rem', height: 20, borderRadius: '2px', borderColor: '#d4af37' }} 
                    />
                  )}
                  {related.gemstone && related.gemstone !== 'None' && (
                    <Chip 
                      label={related.gemstone} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: '0.65rem', height: 20, borderRadius: '2px' }} 
                    />
                  )}
                </Box>

                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  {related.name}
                </Typography>
                
                <Typography variant="body1" sx={{ color: '#b78b20', fontWeight: 700, mt: 0.5 }}>
                  {formatInr(related.price)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductPage;
