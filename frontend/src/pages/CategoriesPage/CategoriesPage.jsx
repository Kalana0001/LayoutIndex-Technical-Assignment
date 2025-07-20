import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesPage.css';
import {
  PlusSquare,
  ChevronRight,
  Edit,
  Trash2,
} from 'lucide-react';
import AddCategoryModal from '../../components/Common/AddCategoryModal/AddCategoryModal';
import AddSubCategoryModal from '../../components/Common/AddSubCategoryModal/AddSubCategoryModal';
import EditCategoryModal from '../../components/Common/EditCategoryModal/EditCategoryModal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [currentParentId, setCurrentParentId] = useState(null);
  const [currentParentName, setCurrentParentName] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8180/api/categories');
      const categoriesWithExpand = res.data.map(cat => ({ ...cat, isExpanded: false }));
      setCategories(categoriesWithExpand);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      alert('Failed to load categories');
    }
  };

  const toggleCategory = (categoryId) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isExpanded: !cat.isExpanded } : cat
      )
    );
  };

  const openEditModal = (id, currentName) => {
    setEditingCategoryId(id);
    setEditingCategoryName(currentName);
    setShowEditModal(true);
  };

  const handleEditSave = async (newName) => {
    try {
      await axios.put(`http://localhost:8180/api/categories/${editingCategoryId}`, { name: newName });
      alert(`Category updated to "${newName}"!`);
      setShowEditModal(false);
      fetchCategories();
    } catch (error) {
      alert('Failed to update category');
      console.error(error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8180/api/categories/${id}`);
      alert(`Category "${name}" deleted!`);
      fetchCategories(); 
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
  };

  const handleAddSubCategory = (parentId, parentName) => {
    setCurrentParentId(parentId);
    setCurrentParentName(parentName);
    setShowAddSubCategoryModal(true);
  };

  const submitNewCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      alert('Category name cannot be empty');
      return;
    }
    try {
      await axios.post('http://localhost:8180/api/categories', { name, parent_id: null });
      alert(`Category "${name}" added!`);
      setNewCategoryName('');
      setShowAddCategoryModal(false);
      fetchCategories();
    } catch {
      alert('Failed to add category');
    }
  };

  const submitNewSubCategory = async () => {
    const name = newSubCategoryName.trim();
    if (!name || !currentParentId) return;

    try {
      await axios.post('http://localhost:8180/api/categories', { name, parent_id: currentParentId });
      alert(`Subcategory "${name}" added to "${currentParentName}"!`);
      setNewSubCategoryName('');
      setCurrentParentId(null);
      setCurrentParentName('');
      setShowAddSubCategoryModal(false);
      fetchCategories();
    } catch {
      alert('Failed to add subcategory');
    }
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-left">
          <p>Organize your products into categories and subcategories</p>
        </div>
        <button className="add-category-button" onClick={handleAddCategory}>
          <PlusSquare size={20} />
          Add Category
        </button>
      </div>

      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id} className="category-item">
            <div className="category-header" onClick={() => toggleCategory(category.id)}>
              <div className="category-info">
                <ChevronRight
                  size={18}
                  className={`expand-arrow-svg ${category.isExpanded ? 'expanded' : ''}`}
                />
                <span className="category-name">{category.name}</span>
                <span className="category-path">{category.path}</span>
              </div>
              <div className="category-actions">
                <button
                  className="action-button"
                  onClick={(e) => { e.stopPropagation(); openEditModal(category.id, category.name); }}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="action-button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(category.id, category.name); }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {category.isExpanded && (
              <div className="category-content">
                <ul className="category-list">
                  {category.subcategories.map(sub => (
                    <li key={sub.id} className="subcategory-item">
                      <div className="subcategory-info">
                        <span className="status-dot"></span>
                        <span className="subcategory-name">{sub.name}</span>
                        <span className="subcategory-path">{sub.path}</span>
                      </div>
                      <div className="category-actions">
                        <button
                          className="action-button"
                          onClick={(e) => { e.stopPropagation(); openEditModal(sub.id, sub.name); }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="action-button"
                          onClick={(e) => { e.stopPropagation(); handleDelete(sub.id, sub.name); }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="add-category-button add-sub-btn"
                  onClick={() => handleAddSubCategory(category.id, category.name)}
                >
                  <PlusSquare size={18} />
                  Add Subcategory
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <AddCategoryModal
        visible={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onAdd={submitNewCategory}
        categoryName={newCategoryName}
        setCategoryName={setNewCategoryName}
      />

      <AddSubCategoryModal
        visible={showAddSubCategoryModal}
        onClose={() => setShowAddSubCategoryModal(false)}
        onAdd={submitNewSubCategory}
        subCategoryName={newSubCategoryName}
        setSubCategoryName={setNewSubCategoryName}
        parentCategoryName={currentParentName}
      />

      <EditCategoryModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSave}
        initialName={editingCategoryName}
      />
    </div>
  );
};

export default CategoriesPage;
