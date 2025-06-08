import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const ProductDetails = () => {  
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [message, setMessage] = useState('');
  const { cartItems, addToCart } = useCart(); // Correctly use useCart for cart operations

  function getProductDetails() {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`); // Use environment variable
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: getProductDetails,
  });

  if (isLoading) {
    return (
      <div className="container py-5">
        <h4>جارٍ تحميل المنتج...</h4>
      </div>
    );
  }

  if (isError) {
    return <h2 className="text-danger text-center py-5">حدث خطأ أثناء جلب بيانات المنتج</h2>;
  }

  const product = data?.data?.data;
  const availableSizes = product?.availableSizes || [];

  function handleSizeSelect(size) {
    setSelectedSize(size);
    setMessage('');
  }

  async function handleAddToCart() {
    // التحقق من اختيار المقاس إذا كان المنتج يحتوي على مقاسات
    if (availableSizes.length > 0 && !selectedSize) {
      setMessage('يرجى اختيار المقاس أولاً');
      return;
    }

    try {
      const response = await addToCart(product._id, 1, selectedSize, product);
      if (response && response.status === 'success') {
        setMessage(`✅ تم إضافة ${product.title}${selectedSize ? ` (مقاس ${selectedSize})` : ''} إلى العربة`);
      } else {
        throw new Error('فشل في الإضافة إلى العربة');
      }
    } catch (error) {
      setMessage('❌ فشل في إضافة المنتج إلى العربة');
    }
  }

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row align-items-center">
        <div className="col-md-4">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-100 rounded shadow"
          />
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

          {availableSizes.length > 0 && (
            <div className="sizes my-4">
              <h5>اختر المقاس:</h5>
              <div className="d-flex gap-2 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`btn btn-outline-primary ${
                      selectedSize === size ? 'active text-white bg-primary' : ''
                    }`}
                    style={{ minWidth: '50px' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-success" onClick={handleAddToCart}>
            أضف إلى العربة
          </button>

          {message && (
            <div className="alert alert-info mt-3">{message}</div>
          )}

          <div className="mt-3">
            <strong>🛒 عدد العناصر في العربة: {cartItems.length}</strong>
          </div>
        </div>
      </div>
    </div>
  );        
};

export default ProductDetails;
