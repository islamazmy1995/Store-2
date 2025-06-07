import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Slider from "react-slick";

const CategorySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500, 
  };
  

  function getCategories() {
    return axios.get('https://ecommerce.routemisr.com/api/v1/categories');
  }

  // استخدام react-query
  const { isLoading, isError, data } = useQuery({
    queryKey: ['categorySlider'],
    queryFn: getCategories
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading categories.</p>;

  return (
    <>
      {data?.data.data ? (
        <Slider {...settings}>
          {data.data.data.map((category) => (
            <div key={category._id} style={{ padding: '10px', textAlign: 'center' }}>
              <img
                src={category.image}
                alt={category.name}
                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <p>{category.name}</p>
            </div>
          ))}
        </Slider>
      ) : null}
    </>
  );
};

export default CategorySlider;
