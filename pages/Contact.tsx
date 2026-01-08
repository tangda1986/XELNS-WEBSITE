
import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import BannerCarousel from '../components/BannerCarousel';

const Contact: React.FC = () => {
  const { companyInfo, contactBanners, addMessage } = useGlobalContext();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    addMessage({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      content: formData.message
    });
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="pt-0 pb-16 min-h-screen bg-white">
      
      {/* Banner */}
      <BannerCarousel banners={contactBanners} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">联系我们</h1>
            <p className="text-gray-600 mb-10 text-lg">
              感谢您对鑫隆盛科技的关注。请通过以下方式联系我们，我们将竭诚为您服务。
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">公司地址</h3>
                  <p className="text-gray-600">{companyInfo.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">联系电话</h3>
                  <p className="text-gray-600">座机: {companyInfo.tel}</p>
                  <p className="text-gray-600 font-medium text-brand-600">手机: {companyInfo.mobile}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">电子邮箱</h3>
                  <p className="text-gray-600">{companyInfo.email}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">工作时间</h3>
                  <p className="text-gray-600">周一至周五: 9:00 - 18:00</p>
                  <p className="text-gray-600">周六: 9:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">在线留言</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-green-800 mb-2">留言已提交</h3>
                 <p className="text-green-700">感谢您的留言，我们的客服专员将尽快与您取得联系。</p>
                 <button onClick={() => setSubmitted(false)} className="mt-6 text-green-700 font-bold hover:underline">发送另一条消息</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                      placeholder="您的姓名" 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">电话 <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                      placeholder="联系电话" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                    placeholder="email@example.com" 
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">留言内容</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" 
                    placeholder="请简述您的需求..."
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-brand-700 text-white font-bold py-3 rounded-lg hover:bg-brand-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Send size={18} />
                  提交留言
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16 bg-gray-200 w-full h-80 rounded-2xl flex items-center justify-center relative overflow-hidden">
             <img src={(companyInfo as any).mapImage || "https://picsum.photos/seed/map_tech/1200/400"} className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-700" alt="Map BG" />
             <div className="relative z-10 bg-white p-6 rounded-lg shadow-xl text-center">
                <MapPin size={32} className="text-brand-600 mx-auto mb-2" />
                <p className="font-bold text-gray-900">公司位置示意图</p>
                <p className="text-xs text-gray-500">{companyInfo.address}</p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
