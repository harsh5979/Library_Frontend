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
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className={cn('absolute inset-0 bg-muted animate-pulse rounded-inherit', skeletonClassName)} />
      )}
      <img
        src={error ? 'https://images.unsplash.com/photo-1543005152-84524823467f?w=400&h=600&fit=crop' : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        className={cn(className, !loaded && 'opacity-0')}
        {...props}
      />
    </div>
  )
}
