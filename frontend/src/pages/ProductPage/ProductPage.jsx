import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil, Plus, Search, Filter } from 'lucide-react';
import './ProductPage.css';

const ProductPage = ({ setActiveTab, setProductToEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8180/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All Status' ||
      product.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleEdit = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8180/api/product/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const productData = await res.json();
      setProductToEdit(productData);
      setActiveTab('Edit Product');
    } catch (err) {
      alert('Failed to load product details.');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-dashboard-container">
      <div className="product-dashboard-header">
        <div className="product-header-left">
          <h1>Products</h1>
          <p>Manage your product inventory</p>
        </div>
        <button
          className="product-add-product-button"
          onClick={() => setActiveTab('Add New Product')}
        >
          <Plus size={20} className="product-plus-icon-svg" />
          Add Product
        </button>
      </div>

      <div className="product-search-bar-container">
        <div className="product-search-input-wrapper">
          <Search className="product-search-icon-svg" />
          <input
            type="text"
            placeholder="Search products..."
            className="product-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="product-filter-dropdown">
          <Filter className="product-filter-icon-svg" />
          <select
            className="product-status-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onEdit }) => {
  const { image_url, name, description, price, quantity, categories, status } = product;

  const handleDelete = () => {
    alert(`Delete clicked for: ${name}`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={image_url}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x300/cccccc/000000?text=Image+Not+Found';
          }}
        />
        <span className={`product-status-badge ${status.toLowerCase()}`}>{status}</span>

        <div className="product-hover-actions">
          <button className="hover-icon-button" onClick={onEdit}>
            <Pencil size={18} />
          </button>
          <button className="hover-icon-button" onClick={handleDelete}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="product-details">
        <h3>{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-price-qty">
          <span className="product-price">${Number(price).toFixed(2)}</span>
          <span className="product-qty">Qty: {quantity}</span>
        </div>
        <p className="product-categories">
          Categories: {Array.isArray(categories)
            ? categories.map(cat => cat.name || cat).join(', ')
            : categories}
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
