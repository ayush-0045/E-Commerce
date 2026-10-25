import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Search as SearchIcon, 
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { formatInr } from '../utils/currency';
import { products as allProducts } from '../data/products';

const sampleProducts = allProducts;

// Filter options
const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets', 'Bridal Sets'];
const metalTypes = ['Gold', 'White Gold', 'Rose Gold', 'Silver', 'Platinum'];
const gemstones = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'None'];

const ShopPage = () => {
  const [products] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [sortOption, setSortOption] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  // Price range marks for the slider (in INR)
  const priceMarks = [
    { value: 0, label: '₹0' },
    { value: 50000, label: '₹50K' },
    { value: 100000, label: '₹1 Lakh' },
    { value: 200000, label: '₹2 Lakh' },
    { value: 300000, label: '₹3 Lakh' },
    { value: 500000, label: '₹5 Lakh+' },
  ];

  const [filters, setFilters] = useState({
    categories: [],
    metalTypes: [],
    gemstones: [],
    priceRange: [0, 600000], // Adjusted range to accommodate all product prices
    inStock: false,
    onSale: false,
    newArrivals: false,
  });
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add to cart functionality is handled directly in the button's onClick

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
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.metalType.toLowerCase().includes(term) ||
        (product.gemstone && product.gemstone.toLowerCase().includes(term))
      );
    }
    
    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.some(cat => product.category.includes(cat))
      );
    }
    
    if (filters.metalTypes.length > 0) {
      result = result.filter(product => 
        filters.metalTypes.some(type => product.metalType.includes(type))
      );
    }
    
    if (filters.gemstones.length > 0) {
      result = result.filter(product => 
        product.gemstone && filters.gemstones.some(gem => product.gemstone.includes(gem))
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
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };
  
  const handleToggleFilter = (filterName, item) => {
    setFilters(prev => {
      const currentItems = [...prev[filterName]];
      const index = currentItems.findIndex(i => i === item);
      
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
    // Force a re-render to update the filtered products
    setFilteredProducts(prev => [...prev]);
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
      priceRange: [0, 600000],
      inStock: false,
      onSale: false,
      newArrivals: false,
    });
    setSearchTerm('');
    setSortOption('featured');
    // Force a re-render to update the filtered products
    setFilteredProducts([...products]);
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
    
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 600000) {
      activeFilters.push({
        label: `${formatInr(filters.priceRange[0])} - ${formatInr(filters.priceRange[1])}`,
        onDelete: () => handleFilterChange('priceRange', [0, 600000])
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
      
      <FilterSection title="Price Range (USD)">
        <Box sx={{ px: 2, py: 2, bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, boxShadow: 3 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={600000}
            step={5000}
            marks={priceMarks}
            valueLabelFormat={(value) => {
              return formatInr(value);
            }}
            sx={{
              mt: 4,
              '& .MuiSlider-thumb': {
                height: 20,
                width: 20,
                backgroundColor: '#d4af37', // Gold color
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(212, 175, 55, 0.16)',
                },
                '&.Mui-active': {
                  boxShadow: '0px 0px 0px 12px rgba(212, 175, 55, 0.3)',
                },
              },
              '& .MuiSlider-track': {
                height: 6,
                backgroundColor: '#d4af37',
              },
              '& .MuiSlider-rail': {
                height: 6,
                backgroundColor: '#e0e0e0',
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.75rem',
                color: 'text.secondary',
                mt: 1,
              },
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 2,
            p: 2,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}>Min</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                {formatInr(filters.priceRange[0])}
              </Typography>
            </Box>
            <Box sx={{ flex: 2, textAlign: 'center', px: 2 }}>
              <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}>Price Range</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d4af37' }}>
                {formatInr(filters.priceRange[0])} - {formatInr(filters.priceRange[1])}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 0.5 }}>Max</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                {formatInr(filters.priceRange[1])}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined"
              size="small" 
              onClick={() => handleFilterChange('priceRange', [0, 600000])}
              startIcon={<RefreshIcon fontSize="small" />}
              sx={{ 
                fontSize: '0.75rem',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: '#d4af37',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)'
                }
              }}
            >
              Reset Price Range
            </Button>
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
  
  return (
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
              <Grid container spacing={2} sx={{ p: 2 }}>
                {filteredProducts.map((product) => (
                  <Grid item key={product.id} xs={6} sm={4} md={3} lg={2.4}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}>
                      <CardActions sx={{ p: 0 }}>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                          sx={{ 
                            borderBottomLeftRadius: 0, 
                            borderBottomRightRadius: 0,
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                      <Box sx={{ 
                        position: 'relative',
                        paddingTop: '100%',
                        overflow: 'hidden',
                      }}>
                        <CardMedia
                          component="img"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          image={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle2" noWrap title={product.name}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {product.metalType} • {product.gemstone}
                          </Typography>
                          <Typography variant="subtitle2" color="primary" fontWeight="bold">
                            {formatInr(product.price)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {product.rating} ★ ({product.reviews})
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {product.isOnSale && (
                              <Chip 
                                label="Sale" 
                                size="small" 
                                color="error" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  '& .MuiChip-label': { px: 0.75 }
                                }} 
                              />
                            )}
                            {product.isNew && (
                              <Chip 
                                label="New" 
                                size="small" 
                                color="success" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  '& .MuiChip-label': { px: 0.75 }
                                }} 
                              />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
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


