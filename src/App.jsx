import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Project Pages
import ProjectDetail from './components/projects/ProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* Default Route - Redirect to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Default options
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              // Success toast style
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              // Error toast style
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
