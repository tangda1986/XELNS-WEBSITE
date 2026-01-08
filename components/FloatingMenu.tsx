
import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, QrCode } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

// 自定义 QQ 图标 SVG
const QQIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 1024 1024" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" />
  </svg>
);

const FloatingMenu: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { companyInfo } = useGlobalContext();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItemClass = "w-12 h-12 bg-white shadow-lg rounded-md flex items-center justify-center text-gray-600 hover:bg-brand-600 hover:text-white transition-all duration-300 relative group cursor-pointer border border-gray-100";
  const popupClass = "absolute right-14 top-0 bg-white shadow-xl rounded-lg p-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 origin-right border border-gray-100 transform translate-x-2 group-hover:translate-x-0 z-50 whitespace-nowrap";

  return (
    <div className="fixed right-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      
      {/* Phone Item */}
      <div className={menuItemClass}>
        <Phone size={20} />
        <div className={popupClass}>
          <div className="text-brand-700 font-bold text-lg">{companyInfo.mobile}</div>
          <div className="text-gray-500 text-xs">7x24小时服务热线</div>
        </div>
      </div>

      {/* WeChat Item */}
      <div className={menuItemClass}>
        <QrCode size={20} />
        <div className={popupClass} style={{ width: '150px', height: 'auto' }}>
           <div className="text-center">
             <img src={companyInfo.wechatQr} alt="WeChat QR" className="w-full h-auto mb-2 rounded" />
             <div className="text-gray-600 text-xs font-medium">扫一扫咨询微信</div>
           </div>
        </div>
      </div>

      {/* QQ Item */}
      <div className={menuItemClass}>
        <QQIcon size={20} />
        <div className={popupClass}>
          {Array.isArray(companyInfo.qq) ? (
            <div className="flex flex-col gap-2 min-w-[120px]">
              {companyInfo.qq.map((qq) => (
                <a 
                  key={qq}
                  href={`http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:bg-gray-50 rounded p-2 transition-colors border-b last:border-0 border-gray-100"
                >
                   <QQIcon size={16} className="text-brand-600" />
                   <div className="flex flex-col">
                     <span className="text-gray-800 font-bold text-sm">{qq}</span>
                     <span className="text-xs text-gray-400">点击咨询</span>
                   </div>
                </a>
              ))}
            </div>
          ) : (
            <a 
              href={`http://wpa.qq.com/msgrd?v=3&uin=${companyInfo.qq}&site=qq&menu=yes`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
               <span className="text-brand-600 font-bold">QQ咨询</span>
               <span className="text-gray-500 text-sm">{companyInfo.qq}</span>
            </a>
          )}
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`${menuItemClass} ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={20} />
      </button>

    </div>
  );
};

export default FloatingMenu;
