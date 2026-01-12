import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { ArrowLeft, CheckCircle2, Phone, Mail, ShieldCheck, ChevronLeft, ChevronRight, Share2, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, companyInfo } = useGlobalContext();
  const product = products.find(p => p.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // 构造图片列表，如果product.images不存在则回退到product.image
  const images = product?.images && product.images.length > 0 ? product.images : (product ? [product.image] : []);

  // 自动轮播逻辑
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    try {
      // 1. 创建离屏容器，用于放置克隆的节点，确保截图时不受视口滚动条影响
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-10000px';
      container.style.left = '-10000px';
      container.style.zIndex = '-1000';
      document.body.appendChild(container);

      // 2. 克隆海报节点
      const clone = posterRef.current.cloneNode(true) as HTMLElement;
      
      // 强制设置样式，确保内容完全展开（消除max-height或overflow限制）
      clone.style.width = '375px'; // 保持固定宽度以保证布局一致
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      clone.style.transform = 'none';
      clone.style.borderRadius = '0'; // 移除圆角以防截图边缘白边
      
      container.appendChild(clone);

      // 等待 DOM 渲染和图片加载（虽然大部分是克隆的，但保险起见）
      // QR码图片可能需要时间加载
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. 执行截图
      const canvas = await html2canvas(clone, {
        useCORS: true,
        scale: 2, // 2倍清晰度
        backgroundColor: '#ffffff',
        width: 375,
        height: clone.offsetHeight, // 使用克隆体的完整高度
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      // 4. 下载图片
      const link = document.createElement('a');
      link.download = `${product.title}-分享海报.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 清理
      document.body.removeChild(container);
    } catch (error) {
      console.error('海报生成失败', error);
      alert('海报生成失败，请重试');
    }
  };

  // 构建当前页面完整 URL (用于二维码)
  const currentUrl = `${window.location.origin}${window.location.pathname}#/products/${product.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-brand-700 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" />
            返回产品中心
          </Link>

          <button 
            onClick={() => setShowPosterModal(true)}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-800 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-brand-200 transition-colors"
          >
            <Share2 size={18} />
            生成分享海报
          </button>
        </div>

        {/* Top Section: Gallery & Basic Info */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Gallery Section */}
            <div className="bg-gray-100 p-6 flex flex-col h-full">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner mb-4 group">
                <img 
                  src={images[activeImageIndex]} 
                  alt={`${product.title} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700" 
                />
                
                {/* Carousel Controls (only if > 1 image) */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.preventDefault(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-brand-500 ring-2 ring-brand-100 opacity-100' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-12 flex flex-col">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex items-center text-brand-700 gap-1 bg-brand-50 px-3 py-1 rounded-full text-sm font-medium border border-brand-100">
                   <ShieldCheck size={16} />
                   <span>官方正品保证</span>
                 </div>
                 <div className="text-gray-400 text-sm">产品编号: {product.id.toUpperCase()}</div>
              </div>

              <div className="prose prose-lg text-gray-600 mb-8 leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">主要特点与优势</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="text-brand-500 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">对该产品感兴趣？</h3>
                  <p className="text-sm text-gray-500 mb-4">联系我们的销售团队获取报价和技术方案。</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={`tel:${companyInfo.mobile}`} className="flex-1 bg-brand-700 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-800 transition-colors shadow-md">
                      <Phone size={18} />
                      电话咨询
                    </a>
                    <Link to="/contact" className="flex-1 bg-white text-gray-800 border border-gray-300 py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                      <Mail size={18} />
                      在线留言
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Details Content Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
               <span className="w-1.5 h-8 bg-brand-700 rounded-full inline-block"></span>
               产品详情
            </h2>
            
            <div className="prose max-w-none text-gray-700">
               {product.details ? (
                 <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.details, { ADD_ATTR: ['target'] }) }} />
               ) : (
                 <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg">
                    暂无更多详细参数，请联系客服获取技术规格书。
                 </div>
               )}
            </div>
        </div>
      </div>

      {/* Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-lg text-gray-900">产品海报预览</h3>
                 <button onClick={() => setShowPosterModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-200 flex justify-center">
                 {/* This is the actual poster area that will be captured */}
                 <div 
                   ref={posterRef} 
                   className="bg-white w-[375px] shadow-lg flex-shrink-0 relative"
                   style={{ minHeight: 'auto' }}
                 >
                    {/* Poster Header Image */}
                    <div className="relative aspect-square w-full">
                       <img src={images[0]} className="w-full h-full object-cover" alt="Product" crossOrigin="anonymous" />
                       <div className="absolute top-4 left-4 bg-brand-600 text-white px-3 py-1 text-sm font-bold rounded-r-full shadow-md">
                         官方正品
                       </div>
                    </div>
                    
                    {/* Poster Body */}
                    <div className="p-6">
                       <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h2>
                       <div className="w-12 h-1.5 bg-brand-500 mb-5 rounded-full"></div>
                       <p className="text-gray-600 text-sm mb-6 line-clamp-4 leading-relaxed bg-gray-50 p-3 rounded">
                          {product.description}
                       </p>

                       <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                             <CheckCircle2 size={14} className="text-brand-600"/> 核心优势
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {product.features?.slice(0,5).map((f, i) => (
                               <span key={i} className="bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded border border-brand-100 font-medium">{f}</span>
                             ))}
                          </div>
                       </div>

                       {/* Poster Footer: QR & Contact */}
                       <div className="mt-2 pt-4 border-t-2 border-dashed border-gray-100 flex items-center gap-4">
                          <div className="bg-white p-1 border rounded shadow-sm w-[88px] h-[88px] flex-shrink-0 flex items-center justify-center">
                             <img src={qrUrl} alt="QR Code" crossOrigin="anonymous" className="w-full h-full" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <p className="text-[10px] text-gray-400 uppercase tracking-widest">Scan Me</p>
                             <div className="font-bold text-brand-800 text-lg leading-none">{companyInfo.nameEn || 'XELNS'}</div>
                             <div className="text-xs font-bold text-gray-700">{companyInfo.name}</div>
                             <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Phone size={12} /> {companyInfo.tel}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 border-t bg-white flex justify-end gap-3 z-10">
                 <button 
                   onClick={() => setShowPosterModal(false)} 
                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                 >
                   取消
                 </button>
                 <button 
                   onClick={handleDownloadPoster} 
                   className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 flex items-center gap-2 shadow-lg transition-colors"
                 >
                   <Download size={18} />
                   保存图片到相册
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;