import axios from "axios";
import React, { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './FeaturedProducts.css'; // تأكد إن فيه تنسيق كويس هنا

const FeaturedProducts = () => {
  // تشغيل AOS عند تحميل الكومبوننت
  useEffect(() => {
    AOS.init({
      duration: 800,        // مدة الأنيميشن
      easing: 'ease-in-out',// طريقة الانتقال
      once: true            // الأنيميشن يحصل مرة واحدة فقط
    });
  }, []);

  // دالة جلب المنتجات من الـ API
  function getFeaturedProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }

  // استخدام React Query لجلب البيانات
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getFeaturedProducts,
  });

  // التعامل مع التحميل والخطأ
  if (isLoading) return <h2 className="text-center py-5">جارٍ التحميل...</h2>;
  if (isError) return <h2 className="text-center py-5 text-danger">حدث خطأ في تحميل البيانات</h2>;

  const products = data?.data?.data || [];

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🛍️ Featured Products</h2>
      <div className="row gy-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="col-6 col-sm-4 col-md-3 col-lg-2"
            data-aos="zoom-in"
            data-aos-delay={index * 100} // تأخير بسيط لكل منتج
          >
            <Link
              to={`/ProductDetails/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="product border rounded-4 shadow-sm p-2 h-100 d-flex flex-column justify-content-between">
                <div className="image-wrapper mb-2">
                  <img
                    className="w-100 rounded"
                    src={product.imageCover}
                    alt={product.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                 

                  <button className="btn btn-sm btn-outline-success w-100 mt-2">
                    Add to cart
                  </button>
                </div>
                <div>
                  <span className="text-success small fw-bold">{product.category?.name}</span>
                  <h6 className="mt-1 mb-0">{product.title.split(" ").slice(0, 3).join(" ")}</h6>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted fw-semibold">{product.price} EGP</span>
                    <span className="badge bg-warning text-dark">
                      <i className="fas fa-star"></i> {product.ratingsAverage}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
