
import React from 'react';
import { MapPin, Phone, Mail, Globe, Hexagon } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { companyInfo } = useGlobalContext();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {companyInfo.logo ? (
                <img src={companyInfo.logo} alt="Logo" className="h-8 w-8 object-contain rounded" />
              ) : (
                <Hexagon className="text-brand-500" size={32} />
              )}
              <div>
                <h3 
                  className="font-bold tracking-tight"
                  style={{
                    fontFamily: companyInfo.nameFontFamilyEn || undefined,
                    fontSize: companyInfo.nameFontSizeEn ? `${companyInfo.nameFontSizeEn}px` : undefined
                  }}
                >
                  {companyInfo.nameEn || 'XELNS'}
                </h3>
                <p 
                  className="text-gray-400"
                  style={{
                    fontFamily: companyInfo.nameFontFamilyCn || undefined,
                    fontSize: companyInfo.nameFontSizeCn ? `${companyInfo.nameFontSizeCn}px` : undefined
                  }}
                >
                  {companyInfo.name || '鑫隆盛科技'}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {companyInfo.footerIntro || '专注于条码自动化识别技术的研究、开发和应用。为您提供合理的成本控制、最可靠的材料品质及最有效的专业服务。'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">快速导航</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-400 hover:text-brand-400 transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">联系我们</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-sm">{companyInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-brand-500 flex-shrink-0" size={18} />
                <span className="text-sm">电话: {companyInfo.tel} / 手机: {companyInfo.mobile}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-500 flex-shrink-0" size={18} />
                <span className="text-sm">邮箱: {companyInfo.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="text-brand-500 flex-shrink-0" size={18} />
                <span className="text-sm">网址: {companyInfo.website}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {companyInfo.copyright || `© ${new Date().getFullYear()} ${companyInfo.name}. All rights reserved.`}
          </p>
          <div className="flex gap-4">
             <Link to="/admin/login" className="text-gray-700 text-xs hover:text-gray-500">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
