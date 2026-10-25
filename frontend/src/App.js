import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/ProductsPage';
import AdminOrders from './pages/admin/OrdersPage';
import NewArrivalsPage from './pages/collections/NewArrivalsPage';
import LimitedEditionPage from './pages/collections/LimitedEditionPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dca009ff', // Gold color
      contrastText: '#ffffff', // White text on primary buttons
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#bdafafff', // White text on secondary buttons
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#ffffff', // White text for better contrast
      secondary: '#e0e0e0', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Helvetica", "Arial", sans-serif',
    allVariants: {
      color: '#ffffff', // Ensure all text is white by default
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
    button: {
      textTransform: 'none', // Prevent uppercase text in buttons
      color: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          textDecoration: 'none',
          '&:hover': {
            color: '#dca009',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                {/* Public Storefront Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/limited-edition" element={<LimitedEditionPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Authenticated Customer Routes */}
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                } />
                <Route path="/account" element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                } />
                
                {/* Legal & Policy Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-and-conditions" element={<TermsPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
