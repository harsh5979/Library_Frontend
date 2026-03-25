import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navbar } from './components/layout/Navbar'
import { HomePage } from './pages/HomePage'
import { BookDetailPage } from './pages/BookDetailPage'
import { RegisterPage } from './pages/RegisterPage'
import { SearchPage } from './pages/SearchPage'
import { LoginPage } from './pages/LoginPage'
import { MyBooksPage } from './pages/MyBooksPage'
import { ProfilePage } from './pages/ProfilePage'
import { Toaster } from './components/ui/toaster'

import { Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { AdminDashboard } from './pages/AdminDashboard'
import { UserManagementPage } from './pages/UserManagementPage'
import { OverdueManagementPage } from './pages/OverdueManagementPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />

  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary/10 selection:text-primary">
          <Navbar />
          <main className="container mx-auto px-4 py-8 translate-all duration-500 min-h-[calc(100vh-250px)]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-books" element={
                <ProtectedRoute>
                  <MyBooksPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roles={['LIBRARIAN', 'SUPER_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['LIBRARIAN', 'SUPER_ADMIN']}>
                   <UserManagementPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/overdue" element={
                <ProtectedRoute roles={['LIBRARIAN', 'SUPER_ADMIN']}>
                   <OverdueManagementPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster />
          
          <footer className="border-t bg-muted/30 py-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                © 2026 BiblioSphere Library Management System. <br />
                Crafted with excellence for advanced learning.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
