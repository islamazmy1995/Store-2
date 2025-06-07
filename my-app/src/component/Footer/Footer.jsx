import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
    <div className="container">
      <div className="row">

        {/* عن المتجر */}
        <div className="col-md-4 mb-3">
          <h5>E-Shop</h5>
          <p>Your one-stop shop for the best products online.</p>
        </div>

        {/* روابط سريعة */}
        <div className="col-md-4 mb-3">
          <h5>Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="/" className="text-white text-decoration-none">Home</a></li>
            <li><a href="/product" className="text-white text-decoration-none">Products</a></li>
            <li><a href="/brands" className="text-white text-decoration-none">Brands</a></li>
            <li><a href="/category" className="text-white text-decoration-none">Categories</a></li>
            <li><a href="/cart" className="text-white text-decoration-none">Cart</a></li> 
          </ul>
        </div>

        {/* تواصل معنا */}
        <div className="col-md-4 mb-3">
          <h5>Contact Us</h5>
          <p>Email: islamazmy1995@gamil.com</p>
          <p>Phone: +021114052908</p>
          <div>
            <a href="https://www.facebook.com/eslam.a.elmasry.2025?locale=ar_AR"  className="text-white me-3" target='-_blank'><i className="bi bi-facebook"></i></a>
            <a href="https://wa.me/201114052908" className="text-white me-3" target="_blank"rel="noopener noreferrer"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>

      </div>

      <hr className="bg-secondary" />

      <div className="text-center small">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </div>
  </footer>
);
};

export default Footer;

