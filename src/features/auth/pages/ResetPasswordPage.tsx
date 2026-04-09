import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/features/auth/services/authService'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid or missing reset token.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(token, newPassword, confirmPassword)
      toast.success('Password reset successfully! You can now log in.')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Token may be expired.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl text-center p-8 border-none ring-1 ring-rose-500/20 bg-rose-50/50">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-rose-600">Invalid Link</h2>
          <p className="text-muted-foreground mt-2 font-medium">This password reset link is invalid or has expired.</p>
          <Button asChild className="mt-8 rounded-xl font-black px-8 h-12">
            <Link to="/forgot-password">Request New Link</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-none ring-1 ring-primary/5 group transition-all duration-500 hover:shadow-primary/5">
        <CardHeader className="space-y-3 pb-8 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-500">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Set New Password</CardTitle>
          <CardDescription className="text-base font-medium">Secure your account with a fresh password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="password"
                  placeholder="New Password"
                  className="pl-11 h-14 rounded-2xl bg-muted/30 border-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 text-lg font-medium"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  className="pl-11 h-14 rounded-2xl bg-muted/30 border-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 text-lg font-medium"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Update Password
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors hover:gap-3"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel and Return
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
