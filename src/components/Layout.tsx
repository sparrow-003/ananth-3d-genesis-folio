import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

// Lazy load background for performance
const ParticleBackground = lazy(() => import('./ParticleBackground'));

const Layout = () => {
  return (
    <>
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
