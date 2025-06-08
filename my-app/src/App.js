import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserContextProvider } from './component/Context/UserContext';
import { CartProvider } from './component/Context/CartContext';
import { CounterContextProvider } from './component/Context/CounterContext';
import Layout from './component/Layout/Layout';
import Home from './component/Home/Home';
import Cart from './component/cart/Cart';
import Brands from './component/Brands/Brands';
import Categories from './component/Categories/Categories';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import NotFound from './component/NotFound/NotFound';
import FeaturedProducts from './component/Products/FeaturedProducts';
import ProductDetails from './component/ProductDetails/ProductDetails';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'brands', element: <Brands /> },
      { path: 'categories', element: <Categories /> },
      { path: 'featured', element: <FeaturedProducts /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <CartProvider>
          <CounterContextProvider>
            <div className="App">
              <RouterProvider router={router} />
            </div>
          </CounterContextProvider>
        </CartProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
