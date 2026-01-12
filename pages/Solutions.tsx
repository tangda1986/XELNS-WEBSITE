
import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { ChevronRight, Box, Layers, Award, ScanBarcode, Settings, MonitorCheck, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';

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

const Solutions: React.FC = () => {
  const { solutions, solutionBanners } = useGlobalContext();

  return (
    <div className="pt-0 min-h-screen bg-gray-50">
      
      {/* Banner */}
      <BannerCarousel banners={solutionBanners} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Text */}
         <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">标签软件与系统集成应用</h1>
          <p className="text-xl text-brand-600">LABEL SOFTWARE AND SYSTEM INTEGRATION APPLICATIONS</p>
        </div>

        {/* Detailed Solutions */}
        <div className="space-y-16">
          
          {[...solutions]
            .sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || ((b.createdAt || 0) - (a.createdAt || 0)))
            .map((solution, index) => {
             const isEven = index % 2 === 0;
             // Use solution.image if available, otherwise fallback to placeholder based on ID
             const imgUrl = solution.image || `https://picsum.photos/seed/${solution.id}/800/600`;

             const iconColorBg = isEven ? 'bg-blue-100' : 'bg-red-100';
             const iconColorText = isEven ? 'text-blue-600' : 'text-red-600';
             const SolutionIcon = getIcon(solution.iconName);

             return (
               <div key={solution.id} className={`bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                 {/* Image Side */}
                 <div className={`h-64 lg:h-auto bg-gray-200 ${!isEven ? 'order-last lg:order-first' : ''}`}>
                    <img src={imgUrl} alt={solution.title} className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Text Side */}
                 <div className="p-10 flex flex-col justify-center">
                    <div className={`w-12 h-12 ${iconColorBg} ${iconColorText} rounded-lg flex items-center justify-center mb-6`}>
                      <SolutionIcon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {solution.desc}
                    </p>
                    
                    <Link 
                      to={`/solutions/${solution.id}`}
                      className="self-start text-brand-600 font-bold border-b-2 border-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 group"
                    >
                      了解更多 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
               </div>
             );
           })}

        </div>
      </div>
    </div>
  );
};

export default Solutions;
