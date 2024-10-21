import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://myjamii-store.onrender.com/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      style={{
        maxWidth: '300px',
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '0px',
      }}
    >
      <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>
        Filter by Category
      </h3>

      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
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
          onFocus={(e) => (e.target.style.borderColor = '#337ab7')}
          onBlur={(e) => (e.target.style.borderColor = '#ddd')}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategoryFilter;