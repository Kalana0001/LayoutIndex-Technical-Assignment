import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditCategoryModal = ({ visible, onClose, onSave, initialName }) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (visible) {
      setCategoryName(initialName || '');
    }
  }, [visible, initialName]);

  if (!visible) return null;

  const handleSave = () => {
    if (!categoryName.trim()) {
      alert('Category name cannot be empty');
      return;
    }
    onSave(categoryName.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Category</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          className="modal-input"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button className="submit-button" onClick={handleSave}>Save</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
