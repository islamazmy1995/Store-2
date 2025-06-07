import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/Layout/Layout";
import Home from "./component/Home/Home";
import NotFound from "./component/NotFound/NotFound";
import Cart from "./component/cart/Cart";
import Brands from "./component/Brands/Brands";
import Login from "./component/Login/Login";
import Register from './component/Register/Register';
import Category from "./component/Categories/Categories";
import { CounterContextProvider } from "./component/Context/CounterContext";
import { UserContextProvider } from "./component/Context/UserContext";
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';
import FeaturedProducts from './component/Products/FeaturedProducts';
import ProductDetails from './component/ProductDetails/ProductDetails';  
import { CartProvider } from './component/Context/CartContext';  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: "brands", element: <ProtectedRoute><Brands /></ProtectedRoute> },
      { path: "category", element: <ProtectedRoute><Category /></ProtectedRoute> },
      { path: "featured", element: <ProtectedRoute><FeaturedProducts /></ProtectedRoute> },
      { path: "ProductDetails/:id", element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },  // صححت هنا برضو
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <CartProvider>
          <CounterContextProvider>
            <RouterProvider router={router} />
          </CounterContextProvider>
        </CartProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
