import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  LocalOffer as ProductsIcon,
  People as UsersIcon,
  AttachMoney as RevenueIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data - replace with actual API calls
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

const categoryData = [
  { name: 'Rings', value: 35 },
  { name: 'Necklaces', value: 25 },
  { name: 'Earrings', value: 20 },
  { name: 'Bracelets', value: 15 },
  { name: 'Others', value: 5 },
];

const recentOrders = [
  {
    id: 'GAH-789012',
    customer: 'John Smith',
    date: '2023-11-10',
    amount: 1299.99,
    status: 'Processing',
    orderItems: 2
  },
  {
    id: 'GAH-789011',
    customer: 'Jane Doe',
    date: '2023-11-09',
    amount: 899.99,
    status: 'Shipped',
    orderItems: 1
  },
  {
    id: 'GAH-789010',
    customer: 'Robert Johnson',
    date: '2023-11-08',
    amount: 459.99,
    status: 'Delivered',
    orderItems: 3
  },
  {
    id: 'GAH-789009',
    customer: 'Emily Davis',
    date: '2023-11-07',
    amount: 1299.99,
    status: 'Processing',
    orderItems: 2
  },
  {
    id: 'GAH-789008',
    customer: 'Michael Wilson',
    date: '2023-11-06',
    amount: 599.99,
    status: 'Delivered',
    orderItems: 1
  },
];

const topProducts = [
  { id: 1, name: 'Diamond Solitaire Ring', sales: 124, revenue: 124000, rating: 4.8 },
  { id: 2, name: 'Gold Plated Necklace', sales: 89, revenue: 89000, rating: 4.6 },
  { id: 3, name: 'Pearl Earrings', sales: 76, revenue: 76000, rating: 4.7 },
  { id: 4, name: 'Silver Pendant', sales: 65, revenue: 65000, rating: 4.5 },
  { id: 5, name: 'Diamond Tennis Bracelet', sales: 54, revenue: 54000, rating: 4.9 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <Card elevation={0} sx={{ 
      border: '1px solid', 
      borderColor: 'divider', 
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            bgcolor: `${color}15`, 
            borderRadius: 2,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: isPositive ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                mr: 0.5
              }}
            >
              {isPositive ? <ArrowUpIcon fontSize="inherit" /> : <ArrowDownIcon fontSize="inherit" />}
              {Math.abs(change)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">vs last month</Typography>
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {typeof value === 'number' && value >= 1000 
            ? `$${(value / 1000).toFixed(1)}K` 
            : value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(change * 10, 100)} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                backgroundColor: isPositive ? 'success.main' : 'error.main',
              }
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <Button variant="contained" color="primary">
          Generate Report
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Revenue" 
            value={125000} 
            change={12.5} 
            icon={RevenueIcon} 
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Orders" 
            value={342} 
            change={8.2} 
            icon={OrdersIcon} 
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Products" 
            value={156} 
            change={5.3} 
            icon={ProductsIcon} 
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Customers" 
            value={1243} 
            change={18.7} 
            icon={UsersIcon} 
            color="#FF9800"
          />
        </Grid>
      </Grid>
      
      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              height: '100%',
              minHeight: 400
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Revenue Overview</Typography>
              <Box>
                <Button size="small" color="primary">This Year</Button>
                <Button size="small">This Month</Button>
                <Button size="small">This Week</Button>
              </Box>
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              height: '100%',
              minHeight: 400
            }}
          >
            <Typography variant="h6" gutterBottom>Sales by Category</Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {categoryData.map((category, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      bgcolor: COLORS[index % COLORS.length], 
                      mr: 1,
                      borderRadius: '2px'
                    }} 
                  />
                  <Typography variant="caption">{category.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Orders & Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button size="small" onClick={() => navigate('/admin/orders')}>View All</Button>
            </Box>
            <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem 
                    button 
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <OrdersIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`Order #${order.id}`} 
                      secondary={`${order.customer} • ${new Date(order.date).toLocaleDateString()}`} 
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="subtitle2">${order.amount.toFixed(2)}</Typography>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        bgcolor: order.status === 'Delivered' ? 'success.light' : 
                                 order.status === 'Shipped' ? 'info.light' : 'warning.light',
                        color: order.status === 'Delivered' ? 'success.dark' : 
                               order.status === 'Shipped' ? 'info.dark' : 'warning.dark',
                        px: 1,
                        borderRadius: 1,
                        mt: 0.5
                      }}>
                        <Typography variant="caption">{order.status}</Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Top Selling Products</Typography>
              <Button size="small" onClick={() => navigate('/admin/products')}>View All</Button>
            </Box>
            <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
              {topProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem 
                    button 
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded"
                        src={`/images/product-${product.id}.jpg`}
                        alt={product.name}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      >
                        <ProductsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography noWrap sx={{ maxWidth: 200 }}>
                          {product.name}
                        </Typography>
                      } 
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <StarIcon color="warning" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption">{product.rating}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {product.sales} sold
                          </Typography>
                        </Box>
                      } 
                    />
                    <Typography variant="subtitle2">
                      ${product.revenue.toLocaleString()}
                    </Typography>
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
