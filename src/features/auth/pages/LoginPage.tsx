import logo from '@/assets/logo.png'
import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute bottom-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-primary/5 p-2 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all shadow-xl shadow-primary/5">
              <img src={logo} alt="IOMD Library" className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
          </Link>
          <h2 className="text-4xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-muted-foreground font-medium">
            Continue your journey into the infinite library.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
