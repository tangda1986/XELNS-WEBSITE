
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { ArrowLeft, Phone, Mail, Box, Layers, Award, ScanBarcode, Settings, MonitorCheck, Headphones } from 'lucide-react';
import DOMPurify from 'dompurify';

const getIcon = (name: string) => {
  switch(name) {
    case 'Box': return Box;
    case 'Layers': return Layers;
    case 'Award': return Award;
    case 'ScanBarcode': return ScanBarcode;
    case 'Settings': return Settings;
    case 'MonitorCheck': return MonitorCheck;
    case 'Headphones': return Headphones;
    default: return Box;
  }
};

const SolutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { solutions, companyInfo } = useGlobalContext();
  const solution = solutions.find(s => s.id === id);

  if (!solution) {
    return <Navigate to="/solutions" replace />;
  }

  const Icon = getIcon(solution.iconName);
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
  }, [solution.content]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/solutions" className="inline-flex items-center text-gray-500 hover:text-brand-700 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" />
            返回解决方案列表
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-visible mb-10">
            {/* Header */}
            <div className="bg-brand-900 text-white p-8 md:p-12 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
                    <Icon size={300} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items.center justify-center mb-6">
                        <Icon size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{solution.title}</h1>
                    <p className="text-brand-200 text-lg max-w-4xl">{solution.desc}</p>
                </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-12">
                <div ref={contentRef} className="prose prose-lg max-w-none text-gray-700 overflow-x-hidden break-words">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.content, { ADD_ATTR: ['target'] }) }} />
                </div>
            </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">需要定制此解决方案？</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                我们的技术专家团队随时准备为您提供详细的方案咨询和现场评估服务。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={`tel:${companyInfo.mobile}`} className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-md">
                    <Phone size={20} />
                    立即咨询专家
                </a>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    <Mail size={20} />
                    提交需求留言
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SolutionDetail;
