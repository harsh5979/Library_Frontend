import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/features/auth/services/authService'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setIsSent(true)
      toast.success('Reset link sent!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-none ring-1 ring-primary/5 group transition-all duration-500 hover:shadow-primary/5">
        <CardHeader className="space-y-3 pb-8 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center ">
            {isSent ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <Mail className="h-8 w-8 text-primary" />}
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">
            {isSent ? 'Mail Sent!' : 'Forgot Password?'}
          </CardTitle>
          <CardDescription className="text-base font-medium">
            {isSent
              ? `We've sent a recovery link to ${email}`
              : "No worries, we'll send you reset instructions."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="email"
                    placeholder="Enter your university email"
                    className="pl-11 h-14 rounded-2xl bg-muted/30 border-none transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 text-lg font-medium"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 bg-linear-to-r from-primary to-blue-600 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-sm font-bold text-center italic">
                Check your spam folder if you don't see it within 2 minutes.
              </div>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl text-lg font-black border-2 transition-all"
                onClick={() => setIsSent(false)}
              >
                Try different email
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors hover:gap-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
