
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Layers, Award, ScanBarcode, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

// Helper to render dynamic icons
const getIcon = (name: string) => {
  switch(name) {
    case 'Box': return Box;
    case 'Layers': return Layers;
    case 'Award': return Award;
    case 'ScanBarcode': return ScanBarcode;
    default: return Box;
  }
};

const Home: React.FC = () => {
  const { products, solutions, homePageData } = useGlobalContext();

  const featuredProducts = products.slice(0, 3);
  const latestSolutions = [...solutions].slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-white">
      
      {/* 1. Cinematic Hero Section with Glass Overlay */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={homePageData.heroImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_30s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-[fade-in-up_1s_ease-out]">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="text-brand-100 font-medium text-sm tracking-widest uppercase">Intelligent Automation Leader</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-2xl whitespace-pre-line animate-[fade-in-up_1s_ease-out_0.2s_both]">
            {homePageData.heroTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-[fade-in-up_1s_ease-out_0.4s_both]">
            {homePageData.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-[fade-in-up_1s_ease-out_0.6s_both]">
            <Link to="/products" className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-brand-500/40 flex items-center justify-center gap-3 group">
              探索产品系列 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all flex items-center justify-center">
              预约专家咨询
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
             <div className="w-1 h-2 bg-white rounded-full"></div>
           </div>
        </div>
      </section>

      {/* 2. Brand Narrative - Asymmetrical Layout */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000" alt="Factory" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-slate-100 rounded-2xl -z-0"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-50 rounded-full blur-3xl opacity-60"></div>
              
              <div className="absolute bottom-10 left-[-20px] bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs animate-[slide-in_1s_ease-out_0.5s_both]">
                 <div className="flex items-center gap-3 mb-2">
                    <Award className="text-brand-600" size={24} />
                    <span className="font-bold text-slate-900">原厂认证合作伙伴</span>
                 </div>
                 <p className="text-xs text-slate-500">Zebra / Honeywell / TSC 核心代理商</p>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">About XELNS</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">{homePageData.introTitle}</h2>
              <div className="text-lg text-slate-600 space-y-6 leading-relaxed">
                <p>{homePageData.introText}</p>
                <p>
                  我们不仅提供顶级的硬件设备，更致力于构建智能化的物联网生态。从生产线的自动化贴标，到仓库的数字化盘点，鑫隆盛为您提供全链路的技术闭环。
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                 <div className="border-l-2 border-slate-200 pl-6">
                    <div className="text-4xl font-bold text-slate-900 mb-1">15<span className="text-brand-600 text-2xl">+</span></div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">Years Experience</div>
                 </div>
                 <div className="border-l-2 border-slate-200 pl-6">
                    <div className="text-4xl font-bold text-slate-900 mb-1">98<span className="text-brand-600 text-2xl">%</span></div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">Client Satisfaction</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products - Minimalist Cards */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-2 block">Selected Products</span>
              <h2 className="text-4xl font-bold text-slate-900">核心产品精选</h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-slate-600 font-medium hover:text-brand-600 transition-colors pb-1 border-b border-slate-300 hover:border-brand-600">
              View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product, idx) => (
              <Link to={`/products/${product.id}`} key={product.id} className="group bg-white rounded-none md:rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="h-72 overflow-hidden relative bg-gray-100">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                     <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-6 py-2 bg-white/90 backdrop-blur rounded-full text-slate-900 font-bold text-sm">
                       查看详情
                     </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col relative">
                   <div className="absolute top-0 right-0 transform -translate-y-1/2 mr-8 bg-brand-600 text-white px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-lg">
                      {product.category}
                   </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors">{product.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-slate-400 text-xs font-mono">{product.id}</span>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <ArrowRight size={14} />
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Solutions - Dark Mode Technical Vibe */}
      <section className="py-32 bg-slate-900 text-white relative">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-slate-800/50 skew-x-12 transform origin-top-left -translate-x-1/4"></div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-1">
                  <span className="text-brand-400 font-bold tracking-widest uppercase text-sm mb-4 block">Solutions</span>
                  <h2 className="text-4xl font-bold mb-8 leading-tight">为行业痛点<br/>提供精准解法</h2>
                  <p className="text-slate-400 mb-10 leading-relaxed">
                     深入制造、物流、零售一线场景，通过软件定义硬件，打造软硬一体的自动化解决方案。
                  </p>
                  <Link to="/solutions" className="inline-flex items-center gap-2 px-8 py-3 border border-slate-600 rounded-lg hover:bg-white hover:text-slate-900 transition-all font-bold">
                     查看所有方案 <ChevronRight size={18} />
                  </Link>
               </div>

               <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {latestSolutions.map((sol) => {
                     const Icon = getIcon(sol.iconName);
                     return (
                        <Link to={`/solutions/${sol.id}`} key={sol.id} className="group bg-slate-800 p-8 rounded-2xl hover:bg-brand-900 transition-colors border border-slate-700 hover:border-brand-700/50">
                           <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-brand-600 transition-colors shadow-lg">
                              <Icon size={24} />
                           </div>
                           <h3 className="text-xl font-bold mb-3 text-white group-hover:text-brand-100">{sol.title}</h3>
                           <p className="text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-300">
                              {sol.desc}
                           </p>
                           <div className="flex items-center text-brand-400 text-sm font-bold gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                              了解更多 <ArrowRight size={16} />
                           </div>
                        </Link>
                     );
                  })}
                  <div className="bg-gradient-to-br from-brand-900 to-slate-900 p-8 rounded-2xl border border-dashed border-slate-700 flex flex-col justify-center items-center text-center">
                      <h3 className="text-xl font-bold text-white mb-2">更多定制方案</h3>
                      <p className="text-slate-400 text-sm mb-6">满足您的特殊业务需求</p>
                      <Link to="/contact" className="text-brand-400 underline hover:text-white transition-colors">联系工程师</Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Services Banner - Clean & Professional */}
      <section className="py-24 bg-brand-600 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-5xl mx-auto px-6 text-center relative z-10 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">全生命周期服务支持</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                     <Box size={32} />
                  </div>
                  <h4 className="font-bold text-lg mb-2">原厂备件库</h4>
                  <p className="text-brand-100 text-sm">100% 正品保障</p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                     <Layers size={32} />
                  </div>
                  <h4 className="font-bold text-lg mb-2">快速响应</h4>
                  <p className="text-brand-100 text-sm">4小时内远程诊断</p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                     <Award size={32} />
                  </div>
                  <h4 className="font-bold text-lg mb-2">专家团队</h4>
                  <p className="text-brand-100 text-sm">15年行业经验</p>
               </div>
            </div>
            <Link to="/service" className="inline-block px-10 py-4 bg-white text-brand-900 font-bold rounded-lg shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all">
               访问服务中心
            </Link>
         </div>
      </section>

    </div>
  );
};

export default Home;
