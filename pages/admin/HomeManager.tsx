
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import ImageInput from '../../components/admin/ImageInput';

const HomeManager: React.FC = () => {
  const { homePageData, setHomePageData, companyInfo, setCompanyInfo } = useGlobalContext();
  const [formData, setFormData] = useState(homePageData);
  const [companyData, setCompanyData] = useState(companyInfo);

  // Sync state if context changes (e.g. initial load)
  useEffect(() => {
    setFormData(homePageData);
    setCompanyData(companyInfo);
  }, [homePageData, companyInfo]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData({ ...companyData, [field]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHomePageData(formData);
    setCompanyInfo(companyData);
    alert('首页及公司信息已更新！');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">首页内容管理</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Header Configuration */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-600 rounded"></span>
                顶部导航栏配置 (Logo & 公司名)
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">顶部 LOGO (建议透明背景 PNG)</label>
                <ImageInput 
                   value={companyData.logo || ''} 
                   onChange={(val) => handleCompanyChange('logo', val)}
                   label=""
                />
                <p className="text-xs text-gray-500 mt-1">上传Logo后，原有的 Hexagon 图标将被替换。若留空则显示默认图标。</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">公司英文名 (显示在 Logo 旁)</label>
                  <input 
                    className="w-full border rounded p-2" 
                    value={companyData.nameEn} 
                    onChange={e => handleCompanyChange('nameEn', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">公司中文简称 (显示在 Logo 下方)</label>
                   <input 
                    className="w-full border rounded p-2" 
                    value={companyData.name} 
                    onChange={e => handleCompanyChange('name', e.target.value)} 
                    placeholder="e.g. 鑫隆盛科技"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-600 rounded"></span>
                Hero 区域 (顶部大图)
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">主标题 (支持 \n 换行)</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  rows={2}
                  value={formData.heroTitle} 
                  onChange={e => handleChange('heroTitle', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">副标题</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  rows={3}
                  value={formData.heroSubtitle} 
                  onChange={e => handleChange('heroSubtitle', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">背景图片</label>
                <ImageInput 
                   value={formData.heroImage} 
                   onChange={(val) => handleChange('heroImage', val)} 
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-600 rounded"></span>
                公司简介区域
            </h3>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium mb-1">简介标题</label>
                <input 
                  className="w-full border rounded p-2" 
                  value={formData.introTitle} 
                  onChange={e => handleChange('introTitle', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">简介文本</label>
                <textarea 
                  className="w-full border rounded p-2" 
                  rows={3}
                  value={formData.introText} 
                  onChange={e => handleChange('introText', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">工厂实力图</label>
                <ImageInput 
                   value={formData.factoryImage} 
                   onChange={(val) => handleChange('factoryImage', val)} 
                />
                <p className="text-xs text-gray-500 mt-1">显示在"为何选择 XELNS"区域的左侧工厂图片</p>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md">保存更改</button>
        </form>
      </div>
    </div>
  );
};

export default HomeManager;
