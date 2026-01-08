
import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { storage } from '../../lib/storage';
import { LayoutDashboard, Package, Image, Building, LogOut, ArrowLeft, Home, Layers, Settings, Mail, Briefcase } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useGlobalContext();

  useEffect(() => {
    if (!storage.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    storage.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: '概览', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: '首页管理', path: '/admin/home-manager', icon: Home },
    { label: '产品管理', path: '/admin/products', icon: Package },
    { label: '解决方案', path: '/admin/solutions', icon: Layers },
    { label: '客户案例', path: '/admin/cases', icon: Briefcase },
    { label: '服务支持', path: '/admin/services', icon: Settings },
    { label: '留言信箱', path: '/admin/messages', icon: Mail },
    { label: '轮播图管理', path: '/admin/banners', icon: Image },
    { label: '关于页面', path: '/admin/about', icon: Building },
    { label: '公司信息', path: '/admin/company', icon: Building },
    { label: '系统设置', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Toast Notification Overlay */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
           <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3">
             <div className="bg-green-500 rounded-full p-1">
               <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <span className="font-medium">{toast.message}</span>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">后台管理</h2>
          <Link to="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-2">
            <ArrowLeft size={12} /> 返回前台首页
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-2"
          >
            <LogOut size={20} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
