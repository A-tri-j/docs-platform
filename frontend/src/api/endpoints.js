import api from "./axios";

export const getCategories = () => api.get("/categories/");
export const getCategory = (id) => api.get(`/categories/${id}`);

export const getTopics = (categoryId) =>
  api.get("/topics/", { params: categoryId ? { category_id: categoryId } : {} });
export const getTopic = (id) => api.get(`/topics/${id}`);

export const getDocuments = (params = {}) => api.get("/documents/", { params });
export const getDocument = (id) => api.get(`/documents/${id}`);

export const searchDocuments = (q) => api.get("/search/", { params: { q } });

export const recordView = (documentId) => api.post(`/documents/${documentId}/view`);
export const getViewStats = (documentId) => api.get(`/documents/${documentId}/views`);

export const getComments = (documentId) => api.get(`/documents/${documentId}/comments`);
export const addComment = (documentId, comment) =>
  api.post(`/documents/${documentId}/comments`, { comment });

export const getTags = () => api.get("/tags/");

export const loginUser = (email, password) => api.post("/auth/login", { email, password });
export const registerUser = (data) => api.post("/auth/register", data);
export const getMe = () => api.get("/auth/me");

// ---------- ADMIN: CATEGORIES ----------
export const createCategory = (data) => api.post("/categories/", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ---------- ADMIN: TOPICS ----------
export const createTopic = (data) => api.post("/topics/", data);
export const updateTopic = (id, data) => api.put(`/topics/${id}`, data);
export const deleteTopic = (id) => api.delete(`/topics/${id}`);

// ---------- ADMIN: DOCUMENTS ----------
export const createDocument = (data) => api.post("/documents/", data);
export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export const uploadDocumentFile = (id, formData) =>
  api.post(`/documents/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteDocumentFile = (fileId) => api.delete(`/documents/files/${fileId}`);

// ---------- ADMIN: TAGS ----------
export const createTag = (data) => api.post("/tags/", data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);
export const attachTag = (tagId, documentId) => api.post(`/tags/${tagId}/documents/${documentId}`);
export const detachTag = (tagId, documentId) => api.delete(`/tags/${tagId}/documents/${documentId}`);
