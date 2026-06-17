import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const emptyForm = { name: "", slug: "", description: "", icon: "" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const load = () => getCategories().then((res) => setCategories(res.data));

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", icon: cat.icon || "" });
    setEditingId(cat.id);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 font-medium text-dark">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat.description}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(cat)} className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 className="inline" />
                  </button>
                  <button onClick={() => setDeleteTarget(cat)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon (optional)</label>
            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. server, database" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all its topics and documents.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
