import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
  Drawer,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Slider,
  useMediaQuery,
  useTheme,
  Badge,
  Skeleton,
  Rating,
  Divider,
  Stack,
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Search as SearchIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  NewReleases as NewIcon,
  Whatshot as BestsellerIcon
} from '@mui/icons-material';
import { addToCart } from '../features/cart/cartSlice';

// Sample product data (replace with actual API call)
const sampleProducts = [
  // Rings
  {
    id: 1,
    name: 'Diamond Solitaire Ring',
    price: 1299.99,
    originalPrice: 1599.99,
    image: '/images/rings-category.jpg',
    category: 'Rings',
    metalType: 'White Gold',
    metalPurity: '18K',
    gemstone: 'Diamond',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true,
    isOnSale: true,
  },
  // Necklaces
  {
    id: 2,
    name: 'Gold Plated Necklace',
    price: 899.99,
    image: '/images/necklaces-category.jpg',
    category: 'Necklaces',
    metalType: 'Yellow Gold',
    metalPurity: '14K',
    gemstone: 'None',
    rating: 4.5,
    reviews: 89,
    inStock: true,
    isNew: false,
    isOnSale: false,
  },
  // Earrings
  {
    id: 3,
    name: 'Pearl Earrings',
    price: 349.99,
    image: '/images/earrings-category.jpg',
    category: 'Earrings',
    metalType: 'Silver',
    metalPurity: '925',
    gemstone: 'Pearl',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    isNew: true,
    isOnSale: false,
  },
  // Bracelets
  {
    id: 4,
    name: 'Silver Bangle Bracelet',
    price: 249.99,
    image: '/images/bracelets-category.jpg',
    category: 'Bracelets',
    metalType: 'Silver',
    metalPurity: '925',
    gemstone: 'None',
    rating: 4.6,
    reviews: 112,
    inStock: true,
    isNew: false,
    isOnSale: true,
  },
  // Diamond Collection
  {
    id: 5,
    name: 'Diamond Tennis Bracelet',
    price: 2499.99,
    image: '/images/rings-category.jpg',
    category: 'Bracelets',
    metalType: 'White Gold',
    metalPurity: '14K',
    gemstone: 'Diamond',
    rating: 4.9,
    reviews: 187,
    inStock: true,
    isBestseller: true
  },
  // Ruby Collection
  {
    id: 6,
    name: 'Ruby Pendant Necklace',
    price: 1299.99,
    image: '/images/necklaces-category.jpg',
    category: 'Necklaces',
    metalType: 'Yellow Gold',
    metalPurity: '18K',
    gemstone: 'Ruby',
    rating: 4.7,
    reviews: 132,
    inStock: true
  },
  // Sapphire Collection
  {
    id: 7,
    name: 'Sapphire Halo Ring',
    price: 1899.99,
    image: '/images/rings-category.jpg',
    category: 'Rings',
    metalType: 'White Gold',
    metalPurity: '14K',
    gemstone: 'Sapphire',
    rating: 4.8,
    reviews: 154,
    inStock: true,
    isNew: true
  },
  // Emerald Collection
  {
    id: 8,
    name: 'Emerald Stud Earrings',
    price: 1599.99,
    image: '/images/earrings-category.jpg',
    category: 'Earrings',
    metalType: 'Yellow Gold',
    metalPurity: '18K',
    gemstone: 'Emerald',
    rating: 4.9,
    reviews: 167,
    inStock: true
  },
  // Pearl Collection
  {
    id: 9,
    name: 'Pearl Strand Necklace',
    price: 899.99,
    image: '/images/necklaces-category.jpg',
    category: 'Necklaces',
    metalType: 'White Gold',
    metalPurity: '14K',
    gemstone: 'Pearl',
    rating: 4.8,
    reviews: 143,
    inStock: true,
    isBestseller: true
  },
  // No Gemstone
  {
    id: 10,
    name: 'Classic Gold Hoops',
    price: 399.99,
    image: '/images/earrings-category.jpg',
    category: 'Earrings',
    metalType: 'Yellow Gold',
    metalPurity: '14K',
    gemstone: 'None',
    rating: 4.6,
    reviews: 98,
    inStock: true,
    isOnSale: true
  }
];

// Filter options
const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets'];
const metalTypes = ['Gold', 'White Gold', 'Silver'];
const gemstones = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'None'];
// Price ranges for filtering (commented out as not currently used)
// const priceRanges = [
//   { label: 'Under $100', value: [0, 100] },

const ShopPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [products] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [sortOption, setSortOption] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    metalTypes: [],
    gemstones: [],
    priceRange: [0, 10000],
    inStock: false,
    onSale: false,
    newArrivals: false,
  });
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter products based on search term
    const filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      product.category.toLowerCase().includes(e.target.value.toLowerCase()) ||
      product.gemstone.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Handle sort
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch(value) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(sortedProducts);
  };

  // Handle URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category],
      }));
    }
  }, [location.search]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.metalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.gemstone && product.gemstone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    if (filters.metalTypes.length > 0) {
      result = result.filter(product => 
        filters.metalTypes.includes(product.metalType)
      );
    }
    
    if (filters.gemstones.length > 0) {
      result = result.filter(product => 
        filters.gemstones.includes(product.gemstone)
      );
    }
    
    // Apply price range
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );
    
    // Apply other filters
    if (filters.inStock) {
      result = result.filter(product => product.inStock);
    }
    
    if (filters.onSale) {
      result = result.filter(product => product.isOnSale);
    }
    
    if (filters.newArrivals) {
      result = result.filter(product => product.isNew);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'top-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured'
        // Keep original order or apply featured logic
        break;
    }
    
    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [filters, products, searchTerm, sortOption]);
  };
  
  const handleToggleFilter = (filterName, item) => {
    setFilters(prev => {
      const currentItems = [...prev[filterName]];
      const index = currentItems.indexOf(item);
      
      if (index === -1) {
        currentItems.push(item);
      } else {
        currentItems.splice(index, 1);
      }
      
      return {
        ...prev,
        [filterName]: currentItems,
      };
    });
  };
  
  const handlePriceRangeChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue,
    }));
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.inStock ? 10 : 0, // Assuming 10 in stock if inStock is true
      qty: 1,
    }));
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      metalTypes: [],
      gemstones: [],
      priceRange: [0, 10000],
      inStock: false,
      onSale: false,
      newArrivals: false,
    });
    setSearchTerm('');
    setSortOption('featured');
  };
  
  const FilterSection = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
  
  const FilterChips = () => {
    const activeFilters = [];
    
    if (filters.categories.length > 0) {
      activeFilters.push(...filters.categories.map(cat => ({
        label: cat,
        onDelete: () => handleToggleFilter('categories', cat)
      })));
    }
    
    if (filters.metalTypes.length > 0) {
      activeFilters.push(...filters.metalTypes.map(type => ({
        label: type,
        onDelete: () => handleToggleFilter('metalTypes', type)
      })));
    }
    
    if (filters.gemstones.length > 0) {
      activeFilters.push(...filters.gemstones.map(gem => ({
        label: gem,
        onDelete: () => handleToggleFilter('gemstones', gem)
      })));
    }
    
    if (filters.inStock) {
      activeFilters.push({
        label: 'In Stock',
        onDelete: () => handleFilterChange('inStock', false)
      });
    }
    
    if (filters.onSale) {
      activeFilters.push({
        label: 'On Sale',
        onDelete: () => handleFilterChange('onSale', false)
      });
    }
    
    if (filters.newArrivals) {
      activeFilters.push({
        label: 'New Arrivals',
        onDelete: () => handleFilterChange('newArrivals', false)
      });
    }
    
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) {
      activeFilters.push({
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
        onDelete: () => handleFilterChange('priceRange', [0, 10000])
      });
    }
    
    if (activeFilters.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {activeFilters.map((filter, index) => (
          <Chip
            key={index}
            label={filter.label}
            onDelete={filter.onDelete}
            size="small"
            sx={{ mb: 1 }}
          />
        ))}
        <Button 
          size="small" 
          onClick={clearAllFilters}
          sx={{ ml: 1 }}
        >
          Clear All
        </Button>
      </Box>
    );
  };
  
  const FilterSidebar = ({ mobile = false }) => (
    <Box 
      sx={{
        width: mobile ? '80%' : 300,
        p: mobile ? 2 : 0,
      }}
    >
      {mobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <FilterSection title="Categories">
        <List dense>
          {categories.map((category) => (
            <ListItem key={category} disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleToggleFilter('categories', category)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{category}</span>
                    <span>
                      {products.filter(p => p.category === category).length}
                    </span>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </ListItem>
          ))}
        </List>
      </FilterSection>
      
      <FilterSection title="Price Range">
        <Box sx={{ px: 2 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
            valueLabelFormat={(value) => `$${value}`}
            sx={{ mt: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">${filters.priceRange[0]}</Typography>
            <Typography variant="body2">${filters.priceRange[1]}</Typography>
          </Box>
        </Box>
      </FilterSection>
      
      <FilterSection title="Metal Type">
        <List dense>
          {metalTypes.map((type) => (
            <ListItem key={type} disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.metalTypes.includes(type)}
                    onChange={() => handleToggleFilter('metalTypes', type)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{type}</span>
                    <span>
                      {products.filter(p => p.metalType === type).length}
                    </span>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </ListItem>
          ))}
        </List>
      </FilterSection>
      
      <FilterSection title="Gemstone">
        <List dense>
          {gemstones.map((gemstone) => (
            <ListItem key={gemstone} disablePadding>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={filters.gemstones.includes(gemstone)}
                    onChange={() => handleToggleFilter('gemstones', gemstone)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{gemstone}</span>
                    <span>
                      {products.filter(p => p.gemstone === gemstone).length}
                    </span>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </ListItem>
          ))}
        </List>
      </FilterSection>
      
      <FilterSection title="Availability">
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              size="small"
            />
          }
          label="In Stock Only"
        />
      </FilterSection>
      
      <FilterSection title="Special Offers">
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                size="small"
              />
            }
            label="On Sale"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.newArrivals}
                onChange={(e) => handleFilterChange('newArrivals', e.target.checked)}
                size="small"
              />
            }
            label="New Arrivals"
          />
        </Box>
      </FilterSection>
      
      <Button 
        variant="outlined" 
        fullWidth 
        onClick={mobile ? () => setMobileFilterOpen(false) : null}
        sx={{ mt: 2 }}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

// Main ShopPage component
const ShopPage = () => {
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Shop Jewelry
      </Typography>
      
      {/* Search and Sort Bar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search jewelry..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { md: 400 } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setMobileFilterOpen(true)}
            sx={{ display: { md: 'none' }, flex: 1 }}
          >
            Filters
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price-low-high">Price: Low to High</MenuItem>
              <MenuItem value="price-high-low">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A to Z</MenuItem>
              <MenuItem value="name-desc">Name: Z to A</MenuItem>
              <MenuItem value="top-rated">Top Rated</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <FilterChips />
      
      <Grid container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <FilterSidebar />
          </Grid>
        )}
        
        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {filteredProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found matching your filters
              </Typography>
              <Button 
                variant="outlined" 
                onClick={clearAllFilters}
                sx={{ mt: 2 }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        position: 'relative',
                        '&:hover': {
                          boxShadow: 6,
                          '& .product-actions': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      {product.isOnSale && (
                        <Chip
                          label="Sale"
                          color="error"
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10, 
                            zIndex: 1,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                      
                      {product.isNew && (
                        <Chip
                          label="New"
                          color="primary"
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            left: 10, 
                            zIndex: 1,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                      
                      <Box sx={{ position: 'relative', pt: '100%' }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        
                        <Box 
                          className="product-actions"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            opacity: 0,
                            transform: 'translateY(10px)',
                            transition: 'all 0.3s ease-in-out',
                          }}
                        >
                          <IconButton 
                            size="small" 
                            sx={{ 
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                            }}
                          >
                            <FavoriteBorderIcon fontSize="small" />
                          </IconButton>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => handleAddToCart(product)}
                            sx={{ 
                              flex: 1,
                              whiteSpace: 'nowrap',
                              minWidth: 'auto',
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              component="span" 
                              sx={{ 
                                color: 'gold',
                                fontSize: '1rem',
                                mr: 0.5,
                              }}
                            >
                              ★
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {product.rating} ({product.reviews})
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="subtitle1" 
                          component="h3" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '3em',
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${product.price.toFixed(2)}
                          </Typography>
                          {product.originalPrice > product.price && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ${product.originalPrice.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ p: 0, pt: 1 }}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          size="small"
                          onClick={() => navigate(`/product/${product.id}`)}
                          sx={{ 
                            borderTopLeftRadius: 0, 
                            borderTopRightRadius: 0,
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '80%',
            maxWidth: 350,
            p: 2,
          },
        }}
      >
        <FilterSidebar mobile />
      </Drawer>
    </Container>
  );
};

export default ShopPage;
