import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    axios.get('http://localhost:5555/categories')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <select onChange={(e) => onCategoryChange(e.target.value)} value={selectedCategory}>
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