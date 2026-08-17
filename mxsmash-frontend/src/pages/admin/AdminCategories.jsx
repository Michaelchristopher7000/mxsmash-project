import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import api from "../../api/axios";
import ConfirmDialog from "../../components/ConfirmDialog";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // holds { id, name } or null

  // Fetch all categories on page load
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create a new category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCreating(true);
    setError("");
    try {
      await api.post("/categories", { name: newCategoryName.trim() });
      setNewCategoryName("");
      fetchCategories(); // refresh the list to show the new category
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  // Delete a category
 const handleDelete = (id, name) => {
  setConfirmDelete({ id, name });
};

const confirmDeleteCategory = async () => {
  try {
    await api.delete(`/categories/${confirmDelete.id}`);
    fetchCategories();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete category");
  } finally {
    setConfirmDelete(null);
  }
};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-1">Categories</h1>
        <p className="text-gray-400">Organize your menu into categories like Burgers, Sides, Drinks</p>
      </div>

      {/* Create new category form */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name (e.g. Burgers)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a437] transition-colors"
        />
        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 bg-[#d4a437] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#c4941f] transition disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Categories list */}
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
          <Tag className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No categories yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-[#d4a437]" />
                <span className="font-medium text-white">{category.name}</span>
              </div>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-gray-500 hover:text-red-400 transition-colors"
                aria-label={`Delete ${category.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.name}"?`}
        message="Products in this category will need to be reassigned."
        onConfirm={confirmDeleteCategory}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
    
  );
};

export default AdminCategories;