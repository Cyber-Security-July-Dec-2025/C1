import { useEffect } from 'react'
import { Routes , Route} from 'react-router'
import { Navigate } from 'react-router'

import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import EmailVerificationPage from './pages/EmailVerificationPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

import LoadingSpinner from './components/LoadingSpinner.jsx'

import DashboardPage from './pages/DashboardPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import KeyManagementPage from './pages/KeyManagementPage.jsx';

import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore.js'

import AuthLayout from './layouts/AuthLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
  const {isCheckingAuth , checkAuth}  = useAuthStore();

  useEffect(() => {
    checkAuth();
  }
  , [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  

  return (
    <div>
      <Routes>
        <Route 
          path='/*' 
          element={
            <ProtectedRoute>
              <Routes>
                  <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardPage />} />
                    <Route path='/upload' element={<UploadPage />} />
                    <Route path='/keys' element={<KeyManagementPage />} />
                    <Route path='*' element={<Navigate to='/' replace />} />
                  </Route>
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route element={<AuthLayout />}>
          <Route 
            path='/signup' 
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route 
            path='/login' 
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            } 
          />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route 
            path='/forgot-password' 
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            } 
          />
          <Route 
            path='/reset-password/:token' 
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            } 
          />
        </Route>
        <Route 
          path='*' 
          element={
            <Navigate to='/' replace />
          } 
        />
      </Routes>
      <Toaster 
        position="bottom-right"
        toastOptions={{
            className: '',
            style: {
                background: '#333',
                color: '#fff',
            },
        }}
      />

    </div>
  )
}

export default App
