import React from 'react';

const brandsList = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' },
  { id: 4, name: 'Reebok' },
];

const Brands = ({ onSelect }) => {
  return (
    <div>
      <h2>Brands</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {brandsList.map(brand => (
          <li
            key={brand.id}
            onClick={() => onSelect?.(brand)}
            style={{
              cursor: 'pointer',
              padding: '8px 12px',
              margin: '4px 0',
              backgroundColor: '#eee',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
          >
            {brand.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;
