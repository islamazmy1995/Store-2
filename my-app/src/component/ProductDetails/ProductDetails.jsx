import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../Context/CartContext';  

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [message, setMessage] = useState('');
  const { cartItems, addToCart } = useCart();  

  function getProductDetails() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: getProductDetails,
  });

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="w-100 h-200 bg-light rounded shadow mb-3"></div>
          </div>
          <div className="col-md-8">
            <div className="mb-3">
              <div className="w-50 h-4 bg-light rounded mb-2"></div>
              <div className="w-75 h-4 bg-light rounded mb-2"></div>
              <div className="w-100 h-4 bg-light rounded mb-2"></div>
            </div>
            <div className="mb-3">
              <div className="w-30 h-4 bg-light rounded"></div>
            </div>
            <div className="mb-3">
              <div className="w-20 h-4 bg-light rounded"></div>
            </div>
            <div className="mb-3">
              <div className="w-50 h-4 bg-light rounded mb-2"></div>
              <div className="w-75 h-4 bg-light rounded mb-2"></div>
            </div>
            <div className="mb-3">
              <div className="w-100 h-4 bg-light rounded mb-2"></div>
              <div className="w-75 h-4 bg-light rounded mb-2"></div>
            </div>
            <div className="mb-3">
              <div className="w-50 h-4 bg-light rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <h2 className="text-danger text-center py-5">حدث خطأ أثناء جلب بيانات المنتج</h2>;
  }

  const product = data?.data?.data;
  const availableSizes = product?.availableSizes || ['38', '39', '40', '41', '42'];

  function handleSizeSelect(size) {
    setSelectedSize(size);
    setMessage('');
  }

  async function handleAddToCart() {
    if (!selectedSize) {
      setMessage('يرجى اختيار المقاس أولاً');
      return;
    }

    try {
      const response = await addToCart(product._id, 1, selectedSize);
      if (response && response.status === 'success') {
        setMessage(`تم إضافة ${product.title} (مقاس ${selectedSize}) إلى العربة`);
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('فشل في إضافة المنتج إلى العربة');
    }
  }

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row align-items-center">
        <div className="col-md-4">
          <img src={product.imageCover} alt={product.title} className="w-100 rounded shadow" />
        </div>
        <div className="col-md-8">
          <h2 className="mb-3">{product.title}</h2>
          <p>{product.description}</p>
          <h4 className="text-success">{product.price} EGP</h4>
          <p><strong>الكمية المتاحة:</strong> {product.quantity}</p>
          <span className="badge bg-dark">{product.category?.name}</span>
          <div className="mt-3">
            <i className="fas fa-star text-warning"></i> {product.ratingsAverage}
          </div>

          <div className="sizes my-4">
            <h5>اختر المقاس:</h5>
            <div className="d-flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`btn btn-outline-primary ${selectedSize === size ? 'active' : ''}`}
                  style={{ minWidth: '50px' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-success" onClick={handleAddToCart}>
            أضف إلى العربة
          </button>

          {message && <div className="alert alert-info mt-3">{message}</div>}

          <div className="mt-3">
            <strong>عدد العناصر في العربة: {cartItems.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
