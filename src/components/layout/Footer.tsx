import { Link } from 'react-router-dom'
import logo from '@/assets/logo.png'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/5 p-1 ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                <img src={logo} alt="IOMD Library" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">IOMD Library</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering academic excellence through seamless digital library management.
            </p>
            <div className="flex items-center gap-4 pt-1 text-sm font-medium">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { label: 'Browse Catalog', to: '/' },
                { label: 'Advanced Search', to: '/search' },
                { label: 'My Books', to: '/my-books' },
                { label: 'My Reservations', to: '/my-reservations' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary transition-colors font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Account</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { label: 'My Profile', to: '/profile' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'Staff Portal', to: '/admin' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary transition-colors font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/60" />
                <span>IOMD Campus, Main Library Building, Block A</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary/60" />
                <span>+91 6351068313</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary/60" />
                <span>library@iomd.edu.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60">
          <span>© {new Date().getFullYear()} IOMD Library. All rights reserved.</span>
          <span>Built for students, faculty &amp; library staff.</span>
        </div>
      </div>
    </footer>
  )
}
