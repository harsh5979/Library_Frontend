import { Library, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.05),_transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_70%,_rgba(59,130,246,0.05),_transparent_50%)]" />

      <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl w-full">
        {/* Left Side: Info */}
        <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700 sticky top-24">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="bg-primary rounded-xl p-2 text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Library className="h-8 w-8" />
              </div>
              <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">
                IOMD Library
              </span>
            </Link>
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              A comprehensive library ecosystem for everyone.
            </h2>
            <p className="text-xl text-muted-foreground/80 font-medium">
              Join thousands of students and faculty members in the most advanced digital library network.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-primary/5 hover:border-primary/10 transition-colors shadow-sm ring-1 ring-black/5">
              <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold">Role-based Access</h4>
                <p className="text-sm text-muted-foreground">Specialized features for Students, Faculty, and Staff.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-primary/5 hover:border-primary/10 transition-colors shadow-sm ring-1 ring-black/5">
              <div className="mt-1 p-2 rounded-lg bg-blue-500/10 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold">Secure Verification</h4>
                <p className="text-sm text-muted-foreground">All accounts go through rigorous ID verification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="animate-in fade-in zoom-in-95 duration-700">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
