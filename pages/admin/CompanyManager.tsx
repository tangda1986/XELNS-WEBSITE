
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
