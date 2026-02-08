import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import QuickAccess from '@/components/home/QuickAccess';
import ValidatorStatus from '@/components/home/ValidatorStatus';
import Statistics from '@/components/home/Statistics';
import Technology from '@/components/home/Technology';
import Roadmap from '@/components/home/Roadmap';
import Community from '@/components/home/Community';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <QuickAccess />
      <ValidatorStatus />
      <Features />
      <Statistics />
      <Technology />
      <Roadmap />
      <Community />
      <Footer />
    </div>
  );
}
