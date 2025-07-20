import React, { useState, useEffect } from 'react';
import './AddNewProductPage.css';
import { ArrowLeft, UploadCloud, FolderKanban } from 'lucide-react';

const AddNewProductPage = ({ setActiveTab }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('Active');
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8180/api/categories')
      .then((res) => res.json())
      .then((data) => {
        const flatList = [];
        data.forEach((cat) => {
          flatList.push({
            id: cat.id,
            name: cat.name,
            type: 'category',
            isSelected: false,
          });
          cat.subcategories.forEach((sub) =>
            flatList.push({
              id: sub.id,
              name: sub.name,
              type: 'subcategory',
              isSelected: false,
              parentId: cat.id,
            })
          );
        });
        setCategories(flatList);
      })
      .catch((err) => {
        console.error('Failed to load categories', err);
      });
  }, []);

  const handleCheckboxChange = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isSelected: !cat.isSelected } : cat
      )
    );
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategoryIds = categories
      .filter((c) => c.isSelected)
      .map((c) => c.id);

    if (!productName || !description || !price || !quantity || !status) {
      alert('Please fill in all required fields.');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      alert('Please select at least one category.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('status', status);
    formData.append('categories', JSON.stringify(selectedCategoryIds));

    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8180/api/product', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('✅ Product created successfully!');
        setActiveTab('Products');
      } else {
        alert(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setLoading(false);
      alert('Failed to submit product. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="addproduct-container">
      <div className="addproduct-header">
        <button className="addproduct-back-button" onClick={() => setActiveTab("Products")}>
          <ArrowLeft className="addproduct-back-arrow-svg" size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="addproduct-form-content">
        <div className="addproduct-basic-info">
          <h2 className="addproduct-section-title">Basic Information</h2>

          <div className="addproduct-form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="addproduct-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="addproduct-price-quantity">
            <div className="addproduct-form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                placeholder="0.00"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="addproduct-form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="addproduct-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div className="addproduct-images-section">
          <h2 className="addproduct-section-title">Product Images</h2>

          <div
            className="addproduct-upload-area"
            onClick={() => document.getElementById('fileInput').click()}
          >
            <UploadCloud className="addproduct-upload-icon" size={28} />
            <p className="addproduct-upload-text">Drag & drop images here, or click to select</p>
            <button type="button" className="addproduct-select-button">Select Images</button>
            <input
              type="file"
              id="fileInput"
              className="addproduct-hidden-input"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="addproduct-image-preview">
              {selectedImages.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Selected product image ${index + 1}`}
                  className="addproduct-thumbnail"
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="addproduct-submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Product'}
        </button>
      </form>

      <hr className="addproduct-divider" />

      <div className="select-cotogories-container">
        <div className="select-cotogories-header">
          <FolderKanban className="select-cotogories-header-icon-svg" size={24} />
          <h1>Categories</h1>
        </div>

        <div className="select-cotogories-grid">
          {categories.map((category) => (
            <div key={category.id} className="select-cotogories-card">
              <input
                type="checkbox"
                id={category.id}
                checked={category.isSelected}
                onChange={() => handleCheckboxChange(category.id)}
              />
              <div className="select-cotogories-info">
                <label htmlFor={category.id} className="select-cotogories-name">{category.name}</label>
                {category.type === 'subcategory' && (
                  <span className="select-cotogories-type">Subcategory</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddNewProductPage;
