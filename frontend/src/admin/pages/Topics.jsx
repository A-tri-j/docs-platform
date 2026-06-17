import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { getCategories, getTopics, createTopic, updateTopic, deleteTopic } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const emptyForm = { name: "", slug: "", description: "", order: 0, category_id: "" };

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    getTopics().then((res) => setTopics(res.data));
    getCategories().then((res) => setCategories(res.data));
  };

  useEffect(() => { load(); }, []);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || "—";

  const openCreate = () => {
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (topic) => {
    setForm({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || "",
      order: topic.order || 0,
      category_id: topic.category_id,
    });
    setEditingId(topic.id);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, category_id: Number(form.category_id), order: Number(form.order) };
      if (editingId) {
        await updateTopic(editingId, payload);
      } else {
        await createTopic(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await deleteTopic(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Topics</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Add Topic
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td className="px-4 py-3 font-medium text-dark">{topic.name}</td>
                <td className="px-4 py-3 text-gray-500">{categoryName(topic.category_id)}</td>
                <td className="px-4 py-3 text-gray-500">{topic.slug}</td>
                <td className="px-4 py-3 text-gray-500">{topic.order}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(topic)} className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 className="inline" />
                  </button>
                  <button onClick={() => setDeleteTarget(topic)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-400">No topics yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Topic" : "Add Topic"}>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all its documents.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
