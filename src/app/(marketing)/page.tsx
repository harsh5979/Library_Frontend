import { Metadata } from 'next';
import { TrendingUp, Clock } from 'lucide-react';
import { bookService } from '@/lib/services/bookService';
import { HeroSection } from '@/components/home/hero-section';
import { BookShelf } from '@/components/home/book-shelf';
import { TrendingSection } from '@/components/home/trending-section';

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Omnishelf - Your Gateway to Absolute Wisdom. Synchronize, retrieve, and govern your intellectual journey with our state-of-the-art library management system.",
};

export default async function HomePage() {
  // Fetch data on the server concurrently for better performance
  const [popularResponse, featuredResponse, newArrivalsResponse] = await Promise.all([
    bookService.getPopular().catch(() => ({ data: [] })),
    bookService.getFeatured().catch(() => ({ data: [] })),
    bookService.getNewArrivals().catch(() => ({ data: [] }))
  ]);

  const popularBooks = popularResponse.data || [];
  const featuredBooks = featuredResponse.data || [];
  const newArrivals = newArrivalsResponse.data || [];

  return (
    <div className="flex flex-col gap-16 pb-24 relative overflow-hidden">
      {/* Hero Section: Cinematic Entry */}
      <HeroSection />

      {/* Popular Tier Component */}
      <BookShelf 
        title="Dominating Circulation" 
        subtitle="Assets with peak temporal demand currently." 
        books={popularBooks} 
        icon={<TrendingUp className="size-8 text-primary" />}
      />

      {/* Trending Protocol Segment — admin-curated featured books */}
      <TrendingSection books={featuredBooks} />

      {/* Arrival Cycle Component */}
      <div className="flex flex-col gap-16 md:gap-24">
        <BookShelf 
          title="Recent Additions" 
          subtitle="Newly catalogue archives for the current cycle." 
          books={newArrivals} 
          icon={<Clock className="size-8 text-primary" />}
        />
      </div>
    </div>
  );
}
