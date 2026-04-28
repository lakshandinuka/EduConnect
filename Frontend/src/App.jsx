import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateTicket from './components/Student/CreateTicket';
import MyTickets from './components/Student/MyTickets';
import AddAttachment from './components/Student/AddAttachment';
import AdminDashboard from './components/Admin/AdminDashboard';
import TicketDetail from './components/Admin/TicketDetail';
import StudentTicketDetail from './components/Student/TicketDetail';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BookAppointment from './components/Student/BookAppointment';
import MyBookings from './components/Student/MyBookings';
import ManageTypes from './components/Admin/ManageTypes';
import ManageSlots from './components/Admin/ManageSlots';
import ViewBookings from './components/Admin/ViewBookings';
// Protected route wrapper
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/create-ticket" element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
          />
          <Route path="/my-tickets" element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
          />

          <Route path="/analytics" element={
            <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
          />
          <Route path="/tickets/:ticketId/add-attachment" element={
            <ProtectedRoute>
              <AddAttachment />
            </ProtectedRoute>
          }
          />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/tickets/:ticketId" element={
            <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
              <TicketDetail />
            </ProtectedRoute>
          }
          />
          <Route path="/my-tickets/:ticketId" element={
            <ProtectedRoute>
              <StudentTicketDetail />
            </ProtectedRoute>
          }
          />

          {/* Appointment Booking Routes - Student */}
          <Route path="/book-appointment" element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
          />
          <Route path="/student/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
          />

          {/* Appointment Booking Routes - Admin */}
          <Route path="/admin/manage-types" element={
            <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
              <ManageTypes />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/manage-slots" element={
            <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
              <ManageSlots />
            </ProtectedRoute>
          }
          />
          <Route path="/admin/view-bookings" element={
            <ProtectedRoute requiredRoles={['DEPT_ADMIN', 'SUPER_ADMIN']}>
              <ViewBookings />
            </ProtectedRoute>
          }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;