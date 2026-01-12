
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { Link, useNavigate } from 'react-router-dom';

const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim() 
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleLinkClick = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsSearchOpen(false)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={32} className="text-gray-500" />
          </button>
        </div>

        <div className="relative mb-12">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="搜索产品名称、型号或分类..." 
            className="w-full text-3xl md:text-5xl font-bold border-b-2 border-gray-200 py-4 outline-none bg-transparent placeholder-gray-300 focus:border-brand-600 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
        </div>

        {searchTerm && (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 pb-20">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
               找到 {filteredProducts.length} 个结果
             </h3>
             
             {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {filteredProducts.map(product => (
                   <div 
                     key={product.id} 
                     onClick={() => handleLinkClick(`/products/${product.id}`)}
                     className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
                   >
                     <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                       <img src={product.image} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-gray-900 truncate group-hover:text-brand-600 transition-colors">{product.title}</h4>
                       <p className="text-sm text-gray-500 truncate">{product.category}</p>
                     </div>
                     <ChevronRight className="text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" size={20} />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-12 text-gray-400">
                 没有找到与 "{searchTerm}" 相关的内容
               </div>
             )}
          </div>
        )}

        {!searchTerm && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
             <div className="text-sm font-bold text-gray-400 mb-2 col-span-full">热门搜索</div>
             {['Zebra', 'TSC', 'PDA', '标签纸', '碳带', '扫描枪'].map(tag => (
               <button 
                 key={tag} 
                 onClick={() => setSearchTerm(tag)}
                 className="text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
               >
                 {tag}
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
