import { MotionConfig } from 'framer-motion';
import { usePathname } from '@/hooks/useRoute';
import DbProvider from '@/store/DbProvider';
import AdminPage from '@/components/admin/AdminPage';
import AmbientBackground from '@/components/layout/AmbientBackground';
import FloatingWaButton from '@/components/layout/FloatingWaButton';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import NetworkBadge from '@/components/layout/NetworkBadge';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import InteractiveShowcase from '@/components/InteractiveShowcase';
import ProductCatalog from '@/components/ProductCatalog';
import WorkflowSteps from '@/components/WorkflowSteps';
import SyariahCommitment from '@/components/SyariahCommitment';
import SpkCalculator from '@/components/SpkCalculator';
import TrackingSection from '@/components/TrackingSection';

function Storefront() {
  return (
    <div className="relative min-h-screen text-slate-900 antialiased">
      <AmbientBackground />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <InteractiveShowcase />
        <ProductCatalog />
        <WorkflowSteps />
        <SyariahCommitment />
        <SpkCalculator />
        <TrackingSection />
      </main>
      <Footer />
      <FloatingWaButton />
      <NetworkBadge />
    </div>
  );
}

function AppRoutes() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname === '/admin/') return <AdminPage />;
  return <Storefront />;
}

export default function App() {
  return (
    <DbProvider>
      <MotionConfig reducedMotion="user">
        <AppRoutes />
      </MotionConfig>
    </DbProvider>
  );
}
