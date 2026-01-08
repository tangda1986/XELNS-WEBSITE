
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Banner } from '../../types';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import ImageInput from '../../components/admin/ImageInput';

const BannerSection: React.FC<{ 
  title: string; 
  banners: Banner[]; 
  onSave: (banners: Banner[]) => void; 
}> = ({ title, banners, onSave }) => {
  const [items, setItems] = useState<Banner[]>(banners);

  const addBanner = () => {
    setItems([...items, { id: `b_${Date.now()}`, image: '', title: '新标题', subtitle: '副标题' }]);
  };

  const removeBanner = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateBanner = (index: number, field: keyof Banner, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const saveSection = () => {
    onSave(items);
    alert('保存成功!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <button onClick={saveSection} className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded font-bold hover:bg-brand-700 shadow-sm">保存更改</button>
      </div>
      
      <div className="space-y-6">
        {items.map((banner, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-4 border p-4 rounded-xl bg-gray-50 items-start relative">
             <div className="w-full md:w-1/3">
                <ImageInput 
                    value={banner.image} 
                    onChange={(val) => updateBanner(idx, 'image', val)} 
                />
             </div>
             
             <div className="flex-1 grid grid-cols-1 gap-3 w-full">
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">主标题</label>
                  <input 
                    className="border p-2 rounded text-sm w-full" 
                    placeholder="主标题" 
                    value={banner.title} 
                    onChange={e => updateBanner(idx, 'title', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 mb-1 block">副标题</label>
                  <input 
                    className="border p-2 rounded text-sm w-full" 
                    placeholder="副标题" 
                    value={banner.subtitle} 
                    onChange={e => updateBanner(idx, 'subtitle', e.target.value)}
                  />
               </div>
             </div>
             
             <button onClick={() => removeBanner(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
      
      <button onClick={addBanner} className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-brand-500 hover:text-brand-600 flex justify-center items-center gap-2 transition-colors">
        <Plus size={18} /> 添加轮播图
      </button>
    </div>
  );
};

const BannerManager: React.FC = () => {
  const context = useGlobalContext();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">轮播图管理</h1>
      <div className="grid grid-cols-1 gap-6">
        <BannerSection title="产品中心页 (顶部)" banners={context.productBanners} onSave={context.setProductBanners} />
        <BannerSection title="解决方案页" banners={context.solutionBanners} onSave={context.setSolutionBanners} />
        <BannerSection title="客户案例页" banners={context.casesBanners} onSave={context.setCasesBanners} />
        <BannerSection title="关于我们页" banners={context.aboutBanners} onSave={context.setAboutBanners} />
        <BannerSection title="服务支持页" banners={context.serviceBanners} onSave={context.setServiceBanners} />
        <BannerSection title="联系我们页" banners={context.contactBanners} onSave={context.setContactBanners} />
      </div>
    </div>
  );
};

export default BannerManager;
