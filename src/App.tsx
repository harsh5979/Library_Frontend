import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layout
import { Navbar } from './components/layout/Navbar'
import { Toaster } from './components/ui/toaster'
import { Button } from './components/ui/button'
import { Link } from 'react-router-dom'

// Features - Auth
import { LoginPage } from './features/auth/pages/LoginPage'
import { RegisterPage } from './features/auth/pages/RegisterPage'

// Features - Books
import { HomePage } from './features/books/pages/HomePage'
import { BookDetailPage } from './features/books/pages/BookDetailPage'
import { SearchPage } from './features/books/pages/SearchPage'

// Features - Users
import { ProfilePage } from './features/users/pages/ProfilePage'
import { MyBooksPage } from './features/users/pages/MyBooksPage'
import { MyReservationsPage } from './features/reservations/pages/MyReservationsPage'

// Features - Admin
import { AdminDashboard } from './features/admin/pages/AdminDashboard'
import { UserManagementPage } from './features/admin/pages/UserManagementPage'
import { OverdueManagementPage } from './features/admin/pages/OverdueManagementPage'
import { ReservationManagementPage } from './features/admin/pages/ReservationManagementPage'

// Components
import { ProtectedRoute } from './components/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary/10 selection:text-primary transition-colors duration-300">
          <Navbar />
          <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-250px)]">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Private Routes - Student/Faculty */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-books" element={<MyBooksPage />} />
                <Route path="/my-reservations" element={<MyReservationsPage />} />
              </Route>

              {/* Librarian/Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['LIBRARIAN', 'SUPER_ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/overdue" element={<OverdueManagementPage />} />
                <Route path="/admin/reservations" element={<ReservationManagementPage />} />
              </Route>
              
              {/* Fallback */}
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
          
          <Toaster />
          
          <footer className="border-t bg-muted/30 py-16 mt-auto">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12 sm:gap-8 items-start mb-12">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary rounded-lg p-1 text-primary-foreground">
                        <LibraryIcon className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-black tracking-tight">IOMD Library</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs">
                      The next generation of library resource management. Empowering academic excellence through seamless digital integration.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Ecosystem</h4>
                    <ul className="space-y-2 text-xs font-bold text-muted-foreground">
                      <li><Link to="/" className="hover:text-primary transition-colors">Library Catalog</Link></li>
                      <li><Link to="/search" className="hover:text-primary transition-colors">Advanced Search</Link></li>
                      <li><Link to="/my-books" className="hover:text-primary transition-colors">My Collection</Link></li>
                    </ul>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Governance</h4>
                    <ul className="space-y-2 text-xs font-bold text-muted-foreground">
                      <li><Link to="/profile" className="hover:text-primary transition-colors">Identity Management</Link></li>
                      <li><Link to="/admin" className="hover:text-primary transition-colors">Library Staff</Link></li>
                      <li><Link to="#" className="hover:text-primary transition-colors">Compliance Protocols</Link></li>
                    </ul>
                 </div>
              </div>
              <div className="pt-8 border-t border-muted text-center">
                <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">
                  © 2026 IOMD Library. All Rights Reserved. <br />
                  <span className="opacity-40">Built for students, faculty, and library staff.</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />
    </svg>
  )
}

export default App
