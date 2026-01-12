
import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Printer, Scan, ShoppingBag, Tablet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';

const Products: React.FC = () => {
  const { products, productBanners } = useGlobalContext();

  const categories = [
    { name: '全部', icon: null },
    { name: '打印设备', icon: Printer },
    { name: '数据采集', icon: Tablet },
    { name: '扫描设备', icon: Scan },
    { name: '耗材', icon: ShoppingBag },
  ];

  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredProducts = activeCategory === '全部' 
    ? products 
    : products.filter(p => p.category === activeCategory || (activeCategory === '扫描设备' && p.category === '数据采集'));

  return (
    <div className="pt-0 min-h-screen bg-gray-50">
      
      {/* Banner Carousel Section */}
      <BannerCarousel banners={productBanners} />

      <div className="pt-16 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">产品系列</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            汇聚ZEBRA、TSC、POSTEK、CITIZEN、HONEYWELL等国际知名品牌，为您提供全方位的条码设备支持。
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-sm ${
                activeCategory === cat.name 
                  ? 'bg-brand-600 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-brand-600'
              }`}
            >
              {cat.icon && <cat.icon size={18} />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col group">
              <div className="h-64 overflow-hidden bg-gray-100 relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm">
                   {product.category}
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">{product.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">主要特点</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.features?.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded border border-brand-100">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  to={`/products/${product.id}`}
                  className="w-full mt-auto bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 group-hover:bg-brand-600"
                >
                  查看详情 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            该分类下暂无产品
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
