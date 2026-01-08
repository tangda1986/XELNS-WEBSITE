import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import BannerCarousel from '../components/BannerCarousel';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Cases: React.FC = () => {
  const { customerCases, casesBanners } = useGlobalContext();

  return (
    <div className="pt-0 min-h-screen bg-gray-50">
      <BannerCarousel banners={casesBanners} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">客户案例</h1>
          <p className="text-gray-600 mt-2">精选真实项目，展示落地成效</p>
        </div>

        <div className="space-y-12">
          {[...customerCases]
            .sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || ((b.createdAt || 0) - (a.createdAt || 0)))
            .map(c => (
            <div key={c.id} className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <div className="h-64 lg:h-auto">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{c.title}</h2>
                <p className="text-gray-600 mb-4">{c.desc}</p>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.content || '') }} />
                </div>
                {c.buttonText && (
                  <a href={c.buttonUrl || '#'} target="_blank" rel="noreferrer" className="inline-block mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700">
                    {c.buttonText}
                  </a>
                )}
              </div>
            </div>
          ))}
          {customerCases.length === 0 && (
            <div className="text-center text-gray-400">暂无客户案例，请到后台新增</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cases;
