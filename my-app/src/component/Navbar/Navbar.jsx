import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo'; 
import './Navbar.css';
import { useUser } from '../Context/UserContext';
import { useCart } from '../Context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { userToken, setUserToken } = useUser(); // Destructure setUserToken
  const { cartItems } = useCart();
  const cartItemCount = cartItems ? cartItems.length : 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      // setSearchQuery(''); // Optionally clear search bar after submission
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUserToken(null); // Update context, CartContext will clear cart due to its useEffect on userToken
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 text-primary" to="/">
          <Logo />
          <span className="ms-2">E-Shop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto align-items-center">
            {userToken && (<>
              <Link className="nav-link mx-2 text-dark" to="/">Home</Link>
              <Link className="nav-link mx-2 text-dark" to="/featured">Products</Link>
              <Link className="nav-link mx-2 text-dark" to="/brands">Brands</Link>
              <Link className="nav-link mx-2 text-dark" to="/category">Categories</Link>

              <form className="d-flex mx-3" role="search" onSubmit={handleSearchSubmit}>
                <input
                  className="form-control form-control-sm"
                  type="search"
                  placeholder="Search products"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-primary btn-sm ms-2" type="submit">
                  Search
                </button>
              </form>

              <Link to="/cart" className="btn btn-outline-primary position-relative mx-2">
                <i className="bi bi-cart-fill"></i> Cart
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </>
          )}

              {userToken ? (
                <>
                  <button className="btn btn-primary mx-2" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-primary mx-2" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-primary mx-2" to="/register">
                    Register
                  </Link>
                </>
              )}

          </div>
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
