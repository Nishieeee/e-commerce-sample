import Navbar from '../components/Navbar';
import Hero3DShowcase from '../components/Hero3DShowcase';
import CategorySpotlight from '../components/CategorySpotlight';
import FeaturedGrid from '../components/FeaturedGrid';
import PromoBento from '../components/PromoBento';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F6] text-[#1E1B4B] selection:bg-rose-500 selection:text-white">
      {/* 1. Glassmorphic Navigation Header & Announcement Bar */}
      <Navbar />

      {/* 2. Interactive 3D Hero Section (Focusing on Electronics & Fashion) */}
      <main className="flex-grow">
        <Hero3DShowcase />

        {/* 3. Category Spotlight & Value Proposition Trust Bar */}
        <CategorySpotlight />

        {/* 4. Trending & Featured Products Grid with Category Filtering */}
        <FeaturedGrid />

        {/* 5. Limited-Time Flash Sale / Bento Bundle Banner */}
        <PromoBento />
      </main>

      {/* 6. Comprehensive Footer & Newsletter Club Signup */}
      <Footer />
    </div>
  );
}
