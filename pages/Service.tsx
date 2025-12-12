
import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { ShieldCheck, MonitorCheck, Settings, Layers, Headphones, ChevronRight } from 'lucide-react';
import BannerCarousel from '../components/BannerCarousel';

const Service: React.FC = () => {
  const { services, serviceBanners } = useGlobalContext();

  const getIcon = (name: string) => {
    switch(name) {
      case 'Settings': return Settings;
      case 'MonitorCheck': return MonitorCheck;
      case 'Layers': return Layers;
      case 'Headphones': return Headphones;
      default: return ShieldCheck;
    }
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
                  <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <Icon size={32} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors flex items-center justify-between">
                    {service.title}
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-brand-500" size={20} />
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-20">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
           
           <h2 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">标签代打印服务流程</h2>
           <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10 text-center">
             {[
               {step: 1, title: '确认需求', desc: '尺寸, 内容, 材质'},
               {step: 2, title: '数据内容', desc: '客户提供或设计'},
               {step: 3, title: '样品确认', desc: '签订合同'},
               {step: 4, title: '标签打印', desc: '根据要求正式打印'},
               {step: 5, title: '检验', desc: '打印品质, 条码读取'},
               {step: 6, title: '交货', desc: '快递或送货'},
             ].map((item) => (
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">打印机日常维护与保养</h2>
              <ul className="space-y-4">
                {[
                  "打印头：热敏方式下，每使用完一卷标签后，清洁一次。",
                  "胶辊：每使用完一卷碳带或三卷标签后清洁。",
                  "标签传感器/碳带传感器：清洁一次。清洁时间仅供参考。",
                  "清洁工具：使用指定的清洁笔或棉签蘸医用酒精。",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                注意：清洁打印头等时要先关闭电源。如果使用非指定的清洁剂引起打印机损坏，本公司概不负责。
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <img src="https://picsum.photos/seed/maintenance/800/600" alt="Maintenance" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white font-bold text-lg">专业维护，延长设备寿命</div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Service;
