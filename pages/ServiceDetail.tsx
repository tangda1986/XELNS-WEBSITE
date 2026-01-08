
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { ArrowLeft, PlayCircle, Download, FileText, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { serviceDetails } = useGlobalContext();
  const serviceData = id ? serviceDetails[id] : null;

  // Initialize active tab to the first tab's ID if available
  const [activeTabId, setActiveTabId] = useState<string>('');

  // Set default active tab when serviceData loads
  React.useEffect(() => {
    if (serviceData?.tabs && serviceData.tabs.length > 0) {
      setActiveTabId(serviceData.tabs[0].id);
    }
  }, [serviceData]);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!serviceData) {
    return <Navigate to="/service" replace />;
  }

  const activeTab = serviceData.tabs.find(t => t.id === activeTabId) || serviceData.tabs[0];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    const targets = Array.from(el.querySelectorAll<HTMLElement>('img, table, figure, iframe, video, div, section'));
    targets.forEach(t => {
      const tw = t.getBoundingClientRect().width;
      if (tw > w) {
        t.style.maxWidth = '100%';
        t.style.width = '100%';
        if (t.tagName.toLowerCase() === 'img' || t.tagName.toLowerCase() === 'video' || t.tagName.toLowerCase() === 'iframe') {
          (t as HTMLImageElement).style.height = 'auto';
          (t as HTMLImageElement).style.display = 'block';
        }
      }
    });
  }, [activeTab?.content]);
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/service" className="inline-flex items-center text-gray-500 hover:text-brand-700 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" />
            返回服务支持列表
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{serviceData.title}</h1>
          <p className="text-gray-500 font-medium">{serviceData.subtitle}</p>
        </div>

        {/* Tab Navigation */}
        {serviceData.tabs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200 pb-1">
            {serviceData.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-6 py-3 rounded-t-lg font-bold text-sm md:text-base transition-colors border-b-2 ${
                  activeTabId === tab.id
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-brand-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        {activeTab ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 min-h-[400px]">
            
            {/* Video / Tutorial List */}
            {activeTab.type === 'video_list' && activeTab.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab.items.map((item, idx) => (
                  <div key={idx} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gray-50">
                      <div className="aspect-video bg-gray-200 relative flex items-center justify-center group-hover:bg-gray-300 transition-colors cursor-pointer">
                        <PlayCircle size={48} className="text-brand-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* Placeholder for real thumbnail if available */}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                        <a href={item.url} className="text-brand-600 text-sm font-bold hover:underline inline-flex items-center gap-1">
                          观看视频 <ArrowLeft size={14} className="rotate-180" />
                        </a>
                      </div>
                  </div>
                ))}
                {activeTab.items.length === 0 && <p className="text-gray-400 col-span-2 text-center py-8">暂无视频数据</p>}
              </div>
            )}

            {/* Download List */}
            {activeTab.type === 'download_list' && activeTab.items && (
              <div className="space-y-4">
                {activeTab.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 transition-colors">
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                        <a href={item.url} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors">
                            <Download size={16} />
                            立即下载
                        </a>
                      </div>
                  </div>
                ))}
                {activeTab.items.length === 0 && <p className="text-gray-400 text-center py-8">暂无下载资源</p>}
              </div>
            )}

            {/* FAQ List */}
            {activeTab.type === 'faq_list' && activeTab.items && (
              <div className="space-y-4">
                {activeTab.items.map((item, idx) => (
                  <div key={idx} className={`border rounded-xl transition-all ${openFaqIndex === idx ? 'border-brand-200 bg-brand-50/30' : 'border-gray-200'}`}>
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className={`flex-shrink-0 ${openFaqIndex === idx ? 'text-brand-600' : 'text-gray-400'}`} size={20} />
                        <span className={`font-bold ${openFaqIndex === idx ? 'text-brand-900' : 'text-gray-700'}`}>{item.title}</span>
                      </div>
                      {openFaqIndex === idx ? <ChevronUp size={20} className="text-brand-500" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-5 pb-5 pl-12">
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
                {activeTab.items.length === 0 && <p className="text-gray-400 text-center py-8">暂无常见问题数据</p>}
              </div>
            )}

            {/* Rich Text */}
            {activeTab.type === 'rich_text' && activeTab.content && (
              <div ref={contentRef} className="prose prose-lg max-w-none text-gray-700 overflow-x-hidden break-words">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeTab.content, { ADD_ATTR: ['target'] }) }} />
              </div>
            )}
             {activeTab.type === 'rich_text' && !activeTab.content && (
              <p className="text-gray-400 text-center py-8">暂无详细内容</p>
            )}

          </div>
        ) : (
           <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-400">
              暂无内容页签
           </div>
        )}

      </div>
    </div>
  );
};

export default ServiceDetail;
