import React from 'react';
import './NotFound.css';
import lostCat from '../Assest/image/616408.png';

const NotFound = () => {
  return (
    <div className="notfound d-flex flex-column justify-content-center align-items-center text-center">
      <div className="icon-wrapper">
        <img src={lostCat} alt="Lost Cat" className="icon animate-slide-in" />
      </div>
      <h1 className="display-1 text-danger animate-404">404</h1>
      <h2 className="mb-3 animate-fade">الصفحة غير موجودة</h2>
      <p className="lead animate-fade-delay">عذرًا، الصفحة التي تبحث عنها غير متوفرة.</p>
      <a href="/" className="btn btn-primary mt-3 animate-btn">العودة للصفحة الرئيسية</a>
    </div>
  );
};

export default NotFound;
