
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { Settings, Headphones, Printer, Wrench, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import BannerCarousel from '../components/BannerCarousel';

const Service: React.FC = () => {
  const { serviceBanners, services, servicePageData } = useGlobalContext();

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'Printer': Printer,
      'Settings': Settings,
      'Wrench': Wrench,
      'FileText': FileText,
      'HelpCircle': HelpCircle,
      'Headphones': Headphones
    };
    return icons[iconName] || Settings;
  };

  return (
    <div className="pt-0 pb-16 min-h-screen bg-white">
      
      {/* Banner */}
      <BannerCarousel banners={serviceBanners} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">技术支持与售后服务</h1>
          <div className="w-24 h-1 bg-brand-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            如果您有以下打印的问题：需要大批量标签、出货量突然增加、不定期使用的小批量标签、
            临时性使用的打印标签... 请找鑫隆盛标签委托打印中心。
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service) => {
             const Icon = getIcon(service.iconName);
             return (
              <Link 
                to={`/service/${service.id}`} 
                key={service.id} 
                className="flex gap-6 p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group relative overflow-hidden"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-md group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-4">{service.description}</p>
                  <span className="text-brand-600 font-medium inline-flex items-center text-sm">
                    查看详情 <ArrowRight size={14} className="ml-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Process Steps */}
        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white mb-20 relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>

           <h2 className="text-3xl font-bold mb-12 relative z-10">{servicePageData.processTitle}</h2>

           <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10 text-center">
             {servicePageData.processSteps.map((item) => (
               <div key={item.step} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                 <div className="text-brand-300 font-bold text-xl mb-2">0{item.step}</div>
                 <div className="font-bold mb-1">{item.title}</div>
                 <div className="text-xs text-brand-200">{item.desc}</div>
               </div>
             ))}
           </div>
        </div>

        {/* Maintenance Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{servicePageData.maintenanceTitle}</h2>
              <ul className="space-y-4">
                {servicePageData.maintenanceItems.map((item, idx) => (
                  <li key={item.id} className="flex items-start gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                注意：清洁打印头等时要先关闭电源。如果使用非指定的清洁剂引起打印机损坏，本公司概不负责。
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <img src={servicePageData.maintenanceImage} alt="Maintenance" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white font-bold text-lg">{servicePageData.maintenanceImageTitle}</div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Service;
