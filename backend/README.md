# Gahana Jewelry - Backend

This is the backend for the Gahana Jewelry e-commerce platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout, password reset)
- Product management (CRUD operations)
- Shopping cart functionality
- Order processing
- Payment integration with Stripe
- File uploads with Cloudinary
- Role-based access control (Admin/User)
- API documentation with Postman

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Stripe account (for payments)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/gahana-jewelry.git
   cd gahana-jewelry/backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` to `.env`
   - Fill in your environment variables

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=Gahana Jewelry

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/logout` - Logout user
- `POST /api/users/password/forgot` - Forgot password
- `PUT /api/users/password/reset/:token` - Reset password
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me/update` - Update profile
- `PUT /api/users/password/update` - Update password

### Products
- `GET /api/products` - Get all products
- `GET /api/product/:id` - Get single product
- `POST /api/admin/product/new` - Create new product (Admin)
- `PUT /api/admin/product/:id` - Update product (Admin)
- `DELETE /api/admin/product/:id` - Delete product (Admin)
- `PUT /api/review` - Create product review
- `GET /api/reviews` - Get product reviews
- `DELETE /api/reviews` - Delete review

### Orders
- `POST /api/order/new` - Create new order
- `GET /api/order/:id` - Get single order
- `GET /api/orders/me` - Get my orders
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/order/:id` - Update order (Admin)
- `DELETE /api/admin/order/:id` - Delete order (Admin)

### Payments
- `POST /api/payment/process` - Process payment
- `GET /api/stripeapi` - Get Stripe API key

## Deployment

### Production
1. Set `NODE_ENV=production` in your environment variables
2. Run `npm run build`
3. Start the server with `npm start`

### Heroku
1. Create a new Heroku app
2. Set up MongoDB Atlas and add the connection string to Heroku config vars
3. Set up other environment variables in Heroku
4. Push to Heroku
   ```bash
   git push heroku main
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Stripe](https://stripe.com/)
- [Cloudinary](https://cloudinary.com/)
