import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { getTags, createTag, deleteTag } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const emptyForm = { name: "", slug: "" };

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const load = () => getTags().then((res) => setTags(res.data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createTag(form);
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await deleteTag(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Tags</h1>
        <button onClick={() => { setForm(emptyForm); setError(""); setModalOpen(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm">
            #{tag.name}
            <button onClick={() => setDeleteTarget(tag)} className="text-red-500 hover:text-red-700">
              <FiTrash2 size={14} />
            </button>
          </span>
        ))}
        {tags.length === 0 && <p className="text-gray-400 text-sm">No tags yet.</p>}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Tag">
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
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
            Create
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Tag"
        message={`Are you sure you want to delete "#${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
