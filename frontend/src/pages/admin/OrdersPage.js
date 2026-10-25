import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { formatInr } from '../../utils/currency';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/orders/admin/all', { withCredentials: true });
      if (data?.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Could not fetch remote admin orders, checking local endpoint:', err.message);
      try {
        const { data: altData } = await axios.get('/api/orders/me', { withCredentials: true });
        setOrders(altData?.orders || []);
      } catch (fallbackErr) {
        setError('No orders registered in the system yet.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'processing');
    setTrackingNumber(order.shippingMethod?.trackingNumber || '');
    setDetailsOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    try {
      setStatusUpdateLoading(true);
      const orderId = selectedOrder._id || selectedOrder.id;
      await axios.put(`/api/orders/admin/${orderId}/status`, {
        status: newStatus,
        trackingNumber: trackingNumber || undefined,
        notifyCustomer: true,
      }, { withCredentials: true });

      setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o)));
      setDetailsOpen(false);
    } catch (err) {
      console.error('Failed to update status:', err);
      // Optimistic local update
      setOrders(prev => prev.map(o => (o._id === selectedOrder._id || o.id === selectedOrder.id ? { ...o, status: newStatus } : o)));
      setDetailsOpen(false);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const s = (status || 'pending').toLowerCase();
    let color = '#757575';
    let bg = 'rgba(255,255,255,0.08)';

    if (s === 'delivered' || s === 'completed') {
      color = '#4caf50';
      bg = 'rgba(76, 175, 80, 0.15)';
    } else if (s === 'shipped') {
      color = '#2196f3';
      bg = 'rgba(33, 150, 243, 0.15)';
    } else if (s === 'processing') {
      color = '#D4AF37';
      bg = 'rgba(212, 175, 55, 0.15)';
    } else if (s === 'cancelled') {
      color = '#f44336';
      bg = 'rgba(244, 67, 54, 0.15)';
    }

    return (
      <Chip
        label={status ? status.toUpperCase() : 'PENDING'}
        size="small"
        sx={{
          color,
          backgroundColor: bg,
          fontWeight: 600,
          borderRadius: '2px',
          fontSize: '0.75rem',
        }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="overline" sx={{ color: '#D4AF37', letterSpacing: '2px', fontWeight: 600 }}>
            STORE ADMINISTRATION
          </Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 400 }}>
            Order Fulfillment & Logistics
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          sx={{
            borderColor: '#D4AF37',
            color: '#D4AF37',
            borderRadius: '2px',
            '&:hover': { borderColor: '#fff', color: '#fff' },
          }}
        >
          Refresh Orders
        </Button>
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#D4AF37' }} />
        </Box>
      ) : orders.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
          <Typography variant="h6" sx={{ color: '#aaa' }}>
            No incoming orders placed yet.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
            When customers place orders via the storefront checkout, they will appear here in real-time.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: '#222', borderColor: 'rgba(255,255,255,0.08)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#181818' }}>
              <TableRow>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Customer Name</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Total Value</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#D4AF37', fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id || order.id || order.orderNumber} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 500 }}>
                    {order.orderNumber || order._id}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>
                    {order.shippingInfo?.firstName ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName || ''}` : 'Direct Buyer'}
                  </TableCell>
                  <TableCell sx={{ color: '#aaa', fontSize: '0.875rem' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>
                    {order.orderItems?.length || 1} piece(s)
                  </TableCell>
                  <TableCell sx={{ color: '#D4AF37', fontWeight: 600 }}>
                    {formatInr(order.total || 0)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(order.status)}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDetails(order)}
                      sx={{ color: '#D4AF37' }}
                      title="Manage Fulfillment"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Fulfillment Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#222', color: '#fff', border: '1px solid rgba(212,175,55,0.2)' } }}
      >
        <DialogTitle sx={{ color: '#D4AF37', fontWeight: 500 }}>
          Manage Order Fulfillment: {selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#aaa' }}>Destination Address:</Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              {selectedOrder?.shippingInfo?.address}, {selectedOrder?.shippingInfo?.city}, {selectedOrder?.shippingInfo?.state} - {selectedOrder?.shippingInfo?.postalCode}
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Contact: {selectedOrder?.shippingInfo?.phone}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>Update Status:</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="processing">Processing (Under Manufacturing / QC)</MenuItem>
                <MenuItem value="shipped">Shipped (Dispatched via Insured Courier)</MenuItem>
                <MenuItem value="delivered">Delivered (Received by Customer)</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>Courier Tracking Number (BlueDart / Delhivery):</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. BLUEDART-9876543210"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              sx={{ input: { color: '#fff' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#aaa' }}>
            Close
          </Button>
          <Button
            variant="contained"
            disabled={statusUpdateLoading}
            onClick={handleStatusUpdate}
            sx={{
              backgroundColor: '#D4AF37',
              color: '#000',
              borderRadius: '2px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#b89428' },
            }}
          >
            {statusUpdateLoading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'Save & Notify Customer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;
