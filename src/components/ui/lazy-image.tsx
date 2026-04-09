import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  skeletonClassName?: string
}

export function LazyImage({ src, alt, className, skeletonClassName, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted/50">
      {!loaded && !error && (
        <div className={cn(
          'absolute inset-0 bg-linear-to-br from-muted via-muted/50 to-muted animate-pulse',
          skeletonClassName
        )} />
      )}
      <img
        src={error ? 'https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        className={cn(
          'transition-all duration-700 ease-out',
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-110',
          className
        )}
        {...props}
      />
    </div>
  )
}
