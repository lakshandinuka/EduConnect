import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import CreateTicket from './components/Student/CreateTicket';
import MyTickets from './components/Student/MyTickets';
import AddAttachment from './components/Student/AddAttachment';
import StudentTicketDetail from './components/Student/TicketDetail';

import AdminDashboard from './components/Admin/AdminDashboard';
import TicketDetail from './components/Admin/TicketDetail';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import AnnouncementStudentView from './components/Student/StudentView';
import AnnouncementAdminDashboard from './components/Admin/AnnouncementDashboard';

import BookAppointment from './components/Student/BookAppointment';
import MyBookings from './components/Student/MyBookings';
import ManageTypes from './components/Admin/ManageTypes';
import ManageSlots from './components/Admin/ManageSlots';
import ViewBookings from './components/Admin/ViewBookings';

import SLAListPage from './components/Admin/SLA/SLAListPage';
import SLAFormPage from './components/Admin/SLA/SLAFormPage';
import SLAViewPage from './components/Admin/SLA/SLAViewPage';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import KBHomePage from './pages/KBHomePage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import KBItemPage from './pages/KBItemPage';
import FAQPage from './pages/FAQPage';
import AdminKBListPage from './pages/AdminKBListPage';
import AdminCreateEditPage from './pages/AdminCreateEditPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminPoliciesPage from './pages/AdminPoliciesPage';
import AdminPreviewPage from './pages/AdminPreviewPage';
import AdminFAQPage from './pages/AdminFAQPage';
import ChatbotWidget from './components/kb/ChatbotWidget';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const showChat = location.pathname.startsWith('/kb');

  return (
    <>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/kb"
            element={
              <ProtectedRoute>
                <KBHomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kb/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kb/category/:categoryId"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kb/item/:itemId"
            element={
              <ProtectedRoute>
                <KBItemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kb/faq"
            element={
              <ProtectedRoute>
                <FAQPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminKBListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb/new"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminCreateEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb/edit/:itemId"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminCreateEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb/categories"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb/policies"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminPoliciesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/kb/preview"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminPreviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminFAQPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-ticket"
            element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-tickets/:ticketId"
            element={
              <ProtectedRoute>
                <StudentTicketDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:ticketId/add-attachment"
            element={
              <ProtectedRoute>
                <AddAttachment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets/:ticketId"
            element={
              <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
                <TicketDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sla"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <SLAListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sla/new"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <SLAFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sla/:id"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <SLAViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sla/:id/edit"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <SLAFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-types"
            element={
              <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
                <ManageTypes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-slots"
            element={
              <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
                <ManageSlots />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/view-bookings"
            element={
              <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
                <ViewBookings />
              </ProtectedRoute>
            }
          />

          <Route path="/announcements" element={<AnnouncementStudentView />} />

          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AnnouncementAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        {showChat && <ChatbotWidget />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
