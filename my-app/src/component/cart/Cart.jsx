                import React from 'react';
import { useCart } from '../Context/CartContext'; // Import useCart
// import { toast } from 'react-toastify'; // Example for toast notifications

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useCart(); // Use context
  const MAX_QUANTITY = 10; // Define max quantity

  const handleQuantityChange = (item, newQuantity) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, MAX_QUANTITY));
    const difference = clampedQuantity - item.quantity;

    if (difference !== 0) {
      addToCart(item.productId, difference, item.size || '', item); // Pass full item data for new items
    }
  };

  const handleIncrement = (item) => {
    if (item.quantity < MAX_QUANTITY) {
      addToCart(item.productId, 1, item.size || '', item);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      addToCart(item.productId, -1, item.size || '', item);
    } else {
      // If quantity is 1, confirm removal
      handleRemoveItem(item.productId, item.size || '');
    }
  };

  const handleRemoveItem = (productId, size) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من العربة؟')) {
      removeFromCart(productId, size);
      // toast.success('تم حذف المنتج من العربة');
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>🛒 عربة التسوق فارغة</h2>
        <p>لم تقم بإضافة أي منتجات إلى العربة بعد.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛒 عربة التسوق</h2>
      <div className="row">
        {cartItems.map((item) => {
          const sizeKey = item.size || ''; // Ensure sizeKey is defined for key and operations
          return (
            <div className="col-md-6 mb-4" key={`${item.productId}-${sizeKey}`}>
              <div className="card h-100 shadow">
                <img
                  src={item.image}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">السعر: {item.price} EGP</p>
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleDecrement(item)}
                      disabled={item.quantity <= 0} // Disable if 0, though decrement handles 1 to remove
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control mx-2"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                      min="1"
                      max={MAX_QUANTITY}
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => handleIncrement(item)}
                      disabled={item.quantity >= MAX_QUANTITY}
                    >
                      +
                    </button>
                  </div>
                  {item.size && <p className="card-text">المقاس: {item.size}</p>}
                  <p className="card-text mt-auto">الإجمالي للمنتج: {item.price * item.quantity} EGP</p>
                  <button
                    className="btn btn-danger w-100 mt-2"
                    onClick={() => handleRemoveItem(item.productId, sizeKey)}
                  >
                    حذف من العربة
                  </button>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <small className="text-muted">الحد الأقصى للكمية: {MAX_QUANTITY}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <hr />
      <h4 className="text-end">الإجمالي الكلي: {totalPrice.toFixed(2)} EGP</h4>
    </div>
  );
};
      
export default Cart;
