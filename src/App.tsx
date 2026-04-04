import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import { Button } from './components/ui/button'
import { Link } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy-loaded pages
const AdminLayout         = lazy(() => import('./components/layout/AdminLayout').then(m => ({ default: m.AdminLayout })))
const LoginPage           = lazy(() => import('./features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage        = lazy(() => import('./features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const HomePage            = lazy(() => import('./features/books/pages/HomePage').then(m => ({ default: m.HomePage })))
const BookDetailPage      = lazy(() => import('./features/books/pages/BookDetailPage').then(m => ({ default: m.BookDetailPage })))
const SearchPage          = lazy(() => import('./features/books/pages/SearchPage').then(m => ({ default: m.SearchPage })))
const ProfilePage         = lazy(() => import('./features/users/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const MyBooksPage         = lazy(() => import('./features/users/pages/MyBooksPage').then(m => ({ default: m.MyBooksPage })))
const MyReservationsPage  = lazy(() => import('./features/reservations/pages/MyReservationsPage').then(m => ({ default: m.MyReservationsPage })))
const AdminDashboard      = lazy(() => import('./features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminBooksPage      = lazy(() => import('./features/admin/pages/AdminBooksPage').then(m => ({ default: m.AdminBooksPage })))
const UserManagementPage  = lazy(() => import('./features/admin/pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })))
const OverdueManagementPage     = lazy(() => import('./features/admin/pages/OverdueManagementPage').then(m => ({ default: m.OverdueManagementPage })))
const ReservationManagementPage = lazy(() => import('./features/admin/pages/ReservationManagementPage').then(m => ({ default: m.ReservationManagementPage })))
const BorrowManagementPage      = lazy(() => import('./features/admin/pages/BorrowManagementPage').then(m => ({ default: m.BorrowManagementPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['LIBRARIAN', 'SUPER_ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/books" element={<AdminBooksPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/overdue" element={<OverdueManagementPage />} />
                <Route path="/admin/borrows" element={<BorrowManagementPage />} />
                <Route path="/admin/reservations" element={<ReservationManagementPage />} />
              </Route>
            </Route>

            <Route path="*" element={<PublicLayout />} />
          </Routes>
        </Suspense>

        <Toaster />
        <Sonner richColors position="top-right" />
      </Router>
    </QueryClientProvider>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary/10 selection:text-primary transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-250px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            <Route path="/my-reservations" element={<MyReservationsPage />} />
          </Route>
          <Route path="/unauthorized" element={
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-4xl font-black tracking-tighter">403 - Access Restricted</h1>
              <p className="text-muted-foreground mt-2 font-medium">You do not have administrative clearance for this terminal.</p>
              <Button asChild className="mt-8 font-black rounded-xl">
                <Link to="/">Return to Safety</Link>
              </Button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
