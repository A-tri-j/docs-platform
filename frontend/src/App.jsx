import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import TopicPage from "./pages/TopicPage";
import DocumentPage from "./pages/DocumentPage";
import SearchPage from "./pages/SearchPage";

// Admin
import AdminLayout from "./admin/layouts/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Categories from "./admin/pages/Categories";
import Topics from "./admin/pages/Topics";
import Documents from "./admin/pages/Documents";
import Tags from "./admin/pages/Tags";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/category/:categoryId"
                element={<CategoryPage />}
              />
              <Route
                path="/docs/:categoryId/:topicId"
                element={<TopicPage />}
              />
              <Route
                path="/docs/:categoryId/:topicId/:documentId"
                element={<DocumentPage />}
              />
              <Route
                path="/document/:documentId"
                element={<DocumentPage />}
              />
              <Route path="/search" element={<SearchPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="topics" element={<Topics />} />
              <Route path="documents" element={<Documents />} />
              <Route path="tags" element={<Tags />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;