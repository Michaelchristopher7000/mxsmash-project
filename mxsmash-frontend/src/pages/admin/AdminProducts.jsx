import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Sandwich, X, Upload, Star } from "lucide-react";
import api from "../../api/axios";
import ConfirmDialog from "../../components/ConfirmDialog";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
  isFeatured: false,
  isAvailable: true,
  addOns: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newAddOn, setNewAddOn] = useState({ name: "", price: "" });
  const [confirmDelete, setConfirmDelete] = useState(null); // holds { id, name } or null

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || "",
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable,
      addOns: product.addOns || [],
    });
    setEditingId(product.id);
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err) {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddAddOn = () => {
    if (!newAddOn.name.trim()) return;
    const addOn = {
      id: Date.now().toString(),
      name: newAddOn.name.trim(),
      price: parseFloat(newAddOn.price) || 0,
    };
    setForm((prev) => ({ ...prev, addOns: [...prev.addOns, addOn] }));
    setNewAddOn({ name: "", price: "" });
  };

  const handleRemoveAddOn = (id) => {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((a) => a.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      closeForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const confirmDeleteProduct = async () => {
    try {
      await api.delete(`/products/${confirmDelete.id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Products</h1>
          <p className="text-gray-400">Manage your menu items</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-[#d4a437] text-black font-bold px-5 py-3 rounded-xl hover:bg-[#c4941f] transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
          <Sandwich className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No products yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-800 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sandwich className="w-12 h-12 text-[#d4a437]/40" />
                  </div>
                )}
                {product.isFeatured && (
                  <span className="absolute top-3 left-3 bg-[#d4a437] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Featured
                  </span>
                )}
                {!product.isAvailable && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Unavailable
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white">{product.name}</h3>
                  <span className="text-[#d4a437] font-bold text-sm ml-2">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-3">
                  {product.category?.name}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in-up"
          onClick={closeForm}
        >
          <div
            className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#141414] rounded-t-3xl z-10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Product" : "New Product"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-gray-500 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-800 overflow-hidden flex-shrink-0">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sandwich className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4a437]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4a437] resize-none"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4a437]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4a437]"
                  >
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="bg-[#141414]"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add-ons builder */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Add-ons (optional)
                </label>
                <div className="space-y-2 mb-3">
                  {form.addOns.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-white">
                        {addon.name}{" "}
                        {addon.price > 0 ? `(+₦${addon.price})` : "(Free)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddOn(addon.id)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add-on name"
                    value={newAddOn.name}
                    onChange={(e) =>
                      setNewAddOn({ ...newAddOn, name: e.target.value })
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4a437]"
                  />
                  <input
                    type="number"
                    placeholder="₦0"
                    value={newAddOn.price}
                    onChange={(e) =>
                      setNewAddOn({ ...newAddOn, price: e.target.value })
                    }
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#d4a437]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAddOn}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#d4a437]"
                  />
                  <span className="text-sm text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#d4a437]" />
                    Featured on homepage
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm({ ...form, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#d4a437]"
                  />
                  <span className="text-sm text-white">Available</span>
                </label>
              </div>

              {/* Submit + Cancel */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 bg-[#d4a437] text-black font-bold py-3.5 rounded-xl hover:bg-[#c4941f] transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Product"
        message={
          confirmDelete
            ? `Are you sure you want to delete "${confirmDelete.name}"?`
            : ""
        }
        onConfirm={confirmDeleteProduct}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminProducts;
