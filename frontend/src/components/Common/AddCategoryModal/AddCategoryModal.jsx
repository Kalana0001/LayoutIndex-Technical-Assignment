import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import './AddCategoryModal.css';

const AddCategoryModal = ({ visible, onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleAdd = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8180/api/categories', {
        name: categoryName.trim(),
      });
      alert(response.data.message);
      setCategoryName('');
      onClose();
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Category</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>
        <input
          type="text"
          className="modal-input"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          disabled={loading}
        />
        <div className="modal-actions">
          <button className="submit-button" onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button className="cancel-button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
