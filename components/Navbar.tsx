
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Hexagon, Search } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { companyInfo, setIsSearchOpen } = useGlobalContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Determine navbar style state
  // Transparent on home before scroll, White/Glass on scroll or other pages
  const isTransparent = isHome && !scrolled;

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isTransparent 
          ? 'bg-transparent border-transparent py-6' 
          : 'bg-white/90 backdrop-blur-lg border-white/20 shadow-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
              {companyInfo.logo ? (
                 <img src={companyInfo.logo} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className={`p-2 rounded-xl transition-all duration-500 ${isTransparent ? 'bg-transparent text-white' : 'bg-transparent text-brand-600'}`}>
                    <Hexagon size={24} strokeWidth={2.5} />
                </div>
              )}
              <div className="flex flex-col">
              <span 
                className={`font-bold tracking-tighter leading-none transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-slate-900'}`}
                style={{
                  fontFamily: companyInfo.nameFontFamilyEn || undefined,
                  fontSize: companyInfo.nameFontSizeEn ? `${companyInfo.nameFontSizeEn}px` : undefined
                }}
              >
                {companyInfo.nameEn || 'XELNS'}
              </span>
              <span 
                className={`tracking-[0.2em] font-medium transition-colors duration-300 ${isTransparent ? 'text-white/60' : 'text-slate-500'}`}
                style={{
                  fontFamily: companyInfo.nameFontFamilyCn || undefined,
                  fontSize: companyInfo.nameFontSizeCn ? `${companyInfo.nameFontSizeCn}px` : undefined
                }}
              >
                {companyInfo.name || '鑫隆盛科技'}
              </span>
              </div>
            </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? (isTransparent ? 'bg-white text-brand-900' : 'bg-brand-50 text-brand-600')
                      : (isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50')
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2.5 rounded-full transition-all duration-300 ${isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
              title="搜索"
            >
               <Search size={20} />
            </button>
            <div className={`h-6 w-px ${isTransparent ? 'bg-white/20' : 'bg-slate-200'}`}></div>
            <a href={`tel:${companyInfo.tel}`} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-base transition-all shadow-lg transform hover:-translate-y-0.5 ${isTransparent ? 'bg-white text-brand-900 hover:bg-gray-100' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
              <Phone size={16} />
              <span>{companyInfo.mobile}</span>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 ${isTransparent ? 'text-white' : 'text-slate-800'}`}
            >
               <Search size={24} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isTransparent ? 'text-white' : 'text-slate-800'} hover:opacity-80 focus:outline-none`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl absolute w-full top-full left-0 border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-300">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-4 rounded-xl text-base font-bold text-center transition-colors ${
                    isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100">
               <a href={`tel:${companyInfo.mobile}`} className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                 <Phone size={18} />
                 致电: {companyInfo.mobile}
               </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
