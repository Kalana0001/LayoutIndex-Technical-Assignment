import React from 'react';
import { X } from 'lucide-react';
import './AddSubCategoryModal.css';

const AddSubCategoryModal = ({
  visible,
  onClose,
  onAdd,
  subCategoryName,
  setSubCategoryName,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Subcategory</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <input
          id="subcategory-name"
          type="text"
          className="modal-input"
          placeholder="Enter subcategory name"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
        />

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button className="submit-button" onClick={onAdd}>Add</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryModal;
