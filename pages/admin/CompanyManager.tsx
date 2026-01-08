
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import ImageInput from '../../components/admin/ImageInput';
import RichTextEditor from '../../components/admin/RichTextEditor';

const CompanyManager: React.FC = () => {
  const { companyInfo, setCompanyInfo, showToast } = useGlobalContext();
  const [formData, setFormData] = useState(companyInfo);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQQChange = (val: string) => {
     // Convert comma separated string to array
     const arr = val.split(',').map(s => s.trim()).filter(s => s);
     setFormData({ ...formData, qq: arr });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyInfo(formData);
    showToast('公司信息已保存！');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">公司信息管理</h1>
      
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        
        {/* Basic Info Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">基本联系信息</h3>
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium mb-2">公司 LOGO (PNG/JPG，建议透明背景)</label>
               <ImageInput 
                  value={(formData as any).logo || ''} 
                  onChange={(val) => handleChange('logo', val)} 
                />
               <p className="text-xs text-gray-500 mt-1">留空将显示默认图标；上传后导航与页脚都会显示该Logo。</p>
             </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">公司中文名</label>
                  <input className="w-full border rounded p-2" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">公司英文名</label>
                  <input className="w-full border rounded p-2" value={formData.nameEn} onChange={e => handleChange('nameEn', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">英文名字体</label>
                  <input className="w-full border rounded p-2" value={(formData as any).nameFontFamilyEn || ''} onChange={e => handleChange('nameFontFamilyEn', e.target.value)} placeholder="e.g. Inter, Arial, 'Microsoft YaHei'" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">英文名字号(px)</label>
                  <input type="number" min={10} max={64} className="w-full border rounded p-2" value={(formData as any).nameFontSizeEn || 0} onChange={e => handleChange('nameFontSizeEn', Number(e.target.value))} placeholder="默认根据样式" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">中文字体</label>
                  <input className="w-full border rounded p-2" value={(formData as any).nameFontFamilyCn || ''} onChange={e => handleChange('nameFontFamilyCn', e.target.value)} placeholder="e.g. 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC'" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文字号(px)</label>
                  <input type="number" min={10} max={64} className="w-full border rounded p-2" value={(formData as any).nameFontSizeCn || 0} onChange={e => handleChange('nameFontSizeCn', Number(e.target.value))} placeholder="默认根据样式" />
                </div>
              </div>

             <div>
                <label className="block text-sm font-medium mb-1">地址</label>
                <input className="w-full border rounded p-2" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
             </div>

             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium mb-1">座机</label>
                 <input className="w-full border rounded p-2" value={formData.tel} onChange={e => handleChange('tel', e.target.value)} />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">手机</label>
                 <input className="w-full border rounded p-2" value={formData.mobile} onChange={e => handleChange('mobile', e.target.value)} />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium mb-1">邮箱</label>
                 <input className="w-full border rounded p-2" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">网址</label>
                 <input className="w-full border rounded p-2" value={formData.website} onChange={e => handleChange('website', e.target.value)} />
               </div>
             </div>

             <div>
                <label className="block text-sm font-medium mb-1">QQ 号码 (用逗号分隔)</label>
                <input 
                  className="w-full border rounded p-2" 
                  value={Array.isArray(formData.qq) ? formData.qq.join(',') : formData.qq} 
                  onChange={e => handleQQChange(e.target.value)} 
                  placeholder="123456, 789012"
                />
             </div>

             <div>
                <label className="block text-sm font-medium mb-2">微信二维码图片 URL / 上传</label>
                <ImageInput 
                   value={formData.wechatQr} 
                   onChange={(val) => handleChange('wechatQr', val)} 
                />
             </div>

             <div>
                <label className="block text-sm font-medium mb-2">公司位置地图 (联系我们页面)</label>
                <ImageInput 
                   value={(formData as any).mapImage || ''} 
                   onChange={(val) => handleChange('mapImage', val)} 
                />
             </div>
             
             <div className="grid grid-cols-1 gap-6">
               <div>
                  <label className="block text-sm font-medium mb-1">页脚简介文本</label>
                  <textarea 
                    className="w-full border rounded p-2" 
                    rows={3}
                    value={(formData as any).footerIntro || ''} 
                    onChange={e => handleChange('footerIntro', e.target.value)} 
                    placeholder="用于网站底部简介区的说明文本"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">版权声明文本</label>
                  <input 
                    className="w-full border rounded p-2" 
                    value={(formData as any).copyright || ''} 
                    onChange={e => handleChange('copyright', e.target.value)} 
                    placeholder={`© ${new Date().getFullYear()} ${formData.name}. All rights reserved.`}
                  />
                  <p className="text-xs text-gray-500 mt-1">留空则自动使用年份与公司名称生成默认版权声明。</p>
               </div>
             </div>
           </div>
        </div>

        {/* About Us Content Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">"关于我们" 页面详情内容</h3>
           <RichTextEditor 
             value={formData.aboutContent || ''} 
             onChange={(val) => handleChange('aboutContent', val)} 
             label="企业介绍内容 (富文本)"
           />
        </div>

        <div className="flex justify-end">
           <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md">
             保存所有更改
           </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyManager;
