import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, ArrowRight, Loader2, XCircle, Home } from 'lucide-react'
import api from '@/lib/axios'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('ERROR')
        setMessage('Missing verification token.')
        return
      }

      try {
        await api.get('/auth/verify-email', { params: { token } })
        setStatus('SUCCESS')
        setMessage('Your email has been successfully verified. You can now access all library features.')
      } catch (error: any) {
        setStatus('ERROR')
        setMessage(error.response?.data?.message || 'Verification link is invalid or has expired.')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border-none ring-1 ring-primary/5 p-4">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-muted animate-pulse">
            {status === 'LOADING' && <Loader2 className="h-10 w-10 text-primary animate-spin" />}
            {status === 'SUCCESS' && <ShieldCheck className="h-10 w-10 text-emerald-500 animate-in zoom-in duration-500" />}
            {status === 'ERROR' && <XCircle className="h-10 w-10 text-rose-500 animate-in shake-in duration-500" />}
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">
            {status === 'LOADING' && 'Verifying Email...'}
            {status === 'SUCCESS' && 'Verification Successful!'}
            {status === 'ERROR' && 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-base font-medium mt-4">
            {status === 'LOADING' ? 'Please wait while we secure your account.' : message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {status === 'SUCCESS' && (
              <Button asChild className="h-14 rounded-2xl text-lg font-black bg-linear-to-r from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20">
                <Link to="/login">
                  Proceed to Login <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}

            {(status === 'ERROR' || status === 'LOADING') && (
              <Button asChild variant="outline" className="h-14 rounded-2xl text-lg font-black border-2">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" /> Return Home
                </Link>
              </Button>
            )}

            {status === 'ERROR' && (
              <p className="text-xs text-center text-muted-foreground mt-4 italic">
                Need help? <Link to="/contact" className="text-primary hover:underline font-bold">Contact support</Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
