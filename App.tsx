
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingMenu from './components/FloatingMenu';
import SearchOverlay from './components/SearchOverlay';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Solutions from './pages/Solutions';
import SolutionDetail from './pages/SolutionDetail';
import Contact from './pages/Contact';
import Service from './pages/Service';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Cases from './pages/Cases';
import NotFound from './pages/NotFound';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import BannerManager from './pages/admin/BannerManager';
import CompanyManager from './pages/admin/CompanyManager';
import HomeManager from './pages/admin/HomeManager';
import SolutionManager from './pages/admin/SolutionManager';
import CaseManager from './pages/admin/CaseManager';
import ServiceManager from './pages/admin/ServiceManager';
import MessageInbox from './pages/admin/MessageInbox';
import Settings from './pages/admin/Settings';
import AboutManager from './pages/admin/AboutManager';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LayoutWithNav: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <SearchOverlay />
      <FloatingMenu />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home-manager" element={<HomeManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="solutions" element={<SolutionManager />} />
            <Route path="cases" element={<CaseManager />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="messages" element={<MessageInbox />} />
            <Route path="banners" element={<BannerManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="company" element={<CompanyManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<LayoutWithNav><Home /></LayoutWithNav>} />
          <Route path="/products" element={<LayoutWithNav><Products /></LayoutWithNav>} />
          <Route path="/products/:id" element={<LayoutWithNav><ProductDetail /></LayoutWithNav>} />
          <Route path="/solutions" element={<LayoutWithNav><Solutions /></LayoutWithNav>} />
          <Route path="/solutions/:id" element={<LayoutWithNav><SolutionDetail /></LayoutWithNav>} />
          <Route path="/cases" element={<LayoutWithNav><Cases /></LayoutWithNav>} />
          <Route path="/service" element={<LayoutWithNav><Service /></LayoutWithNav>} />
          <Route path="/service/:id" element={<LayoutWithNav><ServiceDetail /></LayoutWithNav>} />
          <Route path="/about" element={<LayoutWithNav><About /></LayoutWithNav>} />
          <Route path="/contact" element={<LayoutWithNav><Contact /></LayoutWithNav>} />
          
          {/* 404 Catch-all */}
          <Route path="*" element={<LayoutWithNav><NotFound /></LayoutWithNav>} />
        </Routes>
      </HashRouter>
    </GlobalProvider>
  );
};

export default App;
