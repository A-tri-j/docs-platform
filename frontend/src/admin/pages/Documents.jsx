import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import {
  getTopics, getDocuments, getDocument, createDocument, updateDocument, deleteDocument,
  uploadDocumentFile, deleteDocumentFile,
} from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const emptyForm = { title: "", slug: "", content: "", status: "draft", topic_id: "" };

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [topics, setTopics] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    getDocuments().then((res) => setDocuments(res.data));
    getTopics().then((res) => setTopics(res.data));
  };

  useEffect(() => { load(); }, []);

  const topicName = (id) => topics.find((t) => t.id === id)?.name || "—";

  const openCreate = () => {
    setForm({ ...emptyForm, topic_id: topics[0]?.id || "" });
    setEditingId(null);
    setFiles([]);
    setError("");
    setModalOpen(true);
  };

  const openEdit = async (doc) => {
    const full = await getDocument(doc.id);
    setForm({
      title: full.data.title,
      slug: full.data.slug,
      content: full.data.content || "",
      status: full.data.status,
      topic_id: full.data.topic_id,
    });
    setFiles(full.data.files || []);
    setEditingId(doc.id);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, topic_id: Number(form.topic_id) };
      if (editingId) {
        await updateDocument(editingId, payload);
      } else {
        await createDocument(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await deleteDocument(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !editingId) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      const res = await uploadDocumentFile(editingId, formData);
      setFiles([...files, res.data]);
      setUploadFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
    }
  };

  const handleFileDelete = async (fileId) => {
    await deleteDocumentFile(fileId);
    setFiles(files.filter((f) => f.id !== fileId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Documents</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <FiPlus /> Add Document
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-3 font-medium text-dark">{doc.title}</td>
                <td className="px-4 py-3 text-gray-500">{topicName(doc.topic_id)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => openEdit(doc)} className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 className="inline" />
                  </button>
                  <button onClick={() => setDeleteTarget(doc)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">No documents yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Document" : "Add Document"}>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <select required value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" rows={8}
              placeholder="# Heading\n\nWrite markdown content here..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {editingId && (
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-2">Files / Attachments</label>
              <ul className="space-y-1 mb-3">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded text-sm">
                    <span>{f.file_name}</span>
                    <button type="button" onClick={() => handleFileDelete(f.id)} className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </li>
                ))}
                {files.length === 0 && <li className="text-sm text-gray-400">No files uploaded.</li>}
              </ul>
              <div className="flex gap-2">
                <input type="file" onChange={(e) => setUploadFile(e.target.files[0])}
                  className="text-sm flex-1" />
                <button type="button" onClick={handleFileUpload}
                  className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700">
                  <FiUpload /> Upload
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will also delete its files and comments.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
