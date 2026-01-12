
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

const NotFound: React.FC = () => {
  const { setIsSearchOpen } = useGlobalContext();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8 relative">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-2xl font-bold text-gray-800 bg-gray-50 px-4">页面未找到</div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">
          抱歉，您访问的页面可能已被移除、更名或暂时不可用。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-md"
          >
            <Home size={20} />
            返回首页
          </Link>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Search size={20} />
            搜索产品
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
           <p className="text-sm text-gray-500">
             如果您认为这是一个错误，请 <Link to="/contact" className="text-brand-600 hover:underline">联系我们</Link>。
           </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
