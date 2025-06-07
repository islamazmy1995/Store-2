import React from 'react';

const categoriesList = [
  { id: 'c1', name: 'Running Shoes' },
  { id: 'c2', name: 'Sneakers' },
  { id: 'c3', name: 'Sandals' },
  { id: 'c4', name: 'Boots' },
];

const Categories = ({ onSelect }) => {
  return (
    <div>
      <h2>Categories</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categoriesList.map(category => (
          <li
            key={category.id}
            onClick={() => onSelect?.(category)}
            style={{
              cursor: 'pointer',
              padding: '8px 12px',
              margin: '4px 0',
              backgroundColor: '#eee',
              borderRadius: '5px',
              transition: 'background-color 0.3s',
            }}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
