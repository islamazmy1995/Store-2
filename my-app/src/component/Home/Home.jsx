import React from 'react';
import CategorySlider from '../CategorySlider/CategorySlider';
import FeaturedProducts from '../Products/FeaturedProducts';

const Home = () => {
  return (
    <>
      <section className="mb-5">
        <div className="container">
          <h2 className="text-start mb-4">🧭 Browse Categories</h2>
          <CategorySlider />
        </div>
      </section>

      <section className="mb-5 bg-body-tertiary py-4">
        <div className="container">
          <h2 className="text-start mb-4">🔥 Featured Products</h2>
          <FeaturedProducts />
        </div>
      </section>
    </>
  );
};

export default Home;
