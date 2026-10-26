// src/pages/ProductDetailPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { products } from "../data/products";
import { formatInr } from "../utils/currency";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Convert ID to string to match both string/number cases
  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Product Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sorry, the product you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Back
      </Button>

      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 4,
              objectFit: "cover",
            }}
          />
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating
              value={product.rating}
              precision={0.1}
              readOnly
              size="medium"
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {formatInr(product.price)}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography
                variant="body1"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                }}
              >
                {formatInr(product.originalPrice)}
              </Typography>
            )}
            {product.isOnSale && (
              <Chip 
                label={`Save ${formatInr(product.originalPrice - product.price)}`}
                color="error"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            )}
            {product.isOnSale && (
              <Chip
                label="On Sale"
                color="error"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            <strong>Category:</strong> {product.category}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Metal Type:</strong> {product.metalType}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Purity:</strong> {product.metalPurity}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Gemstone:</strong> {product.gemstone}
          </Typography>

          {product.isNew && (
            <Chip label="New Arrival" color="success" sx={{ mt: 1, mr: 1 }} />
          )}
          {product.inStock ? (
            <Chip label="In Stock" color="primary" sx={{ mt: 1 }} />
          ) : (
            <Chip label="Out of Stock" color="error" sx={{ mt: 1 }} />
          )}

          <Divider sx={{ my: 3 }} />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FavoriteBorderIcon />}
              sx={{ flex: 1 }}
            >
              Add to Wishlist
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
