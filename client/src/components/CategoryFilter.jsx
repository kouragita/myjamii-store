import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    axios.get('https://myjamii-store.onrender.com/categories')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div
      style={{
        maxWidth: '300px',
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          marginBottom: '10px',
          color: '#333'
        }}
      >
        Filter by Category
      </h3>

      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        value={selectedCategory}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '16px',
          color: '#333',
        }}
        onFocus={(e) => e.target.style.borderColor = '#337ab7'}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
