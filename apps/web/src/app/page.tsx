import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Statistics from '@/components/home/Statistics';
import Technology from '@/components/home/Technology';
import Roadmap from '@/components/home/Roadmap';
import Community from '@/components/home/Community';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Statistics />
        <Technology />
        <Roadmap />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
