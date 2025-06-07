import React from 'react';
import { useCart } from '../Context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return <h2 className="text-center my-5">🚫 لا توجد منتجات في العربة</h2>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛒 عربة التسوق</h2>
      <div className="row">
        {cartItems.map((item, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card h-100 shadow">
              <img src={item.image} alt={item.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">السعر: {item.price} EGP</p>
                <p className="card-text">المقاس: {item.size}</p>
                <p className="card-text">الكمية: {item.quantity}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.productId, item.size)}
                >
                  حذف من العربة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
