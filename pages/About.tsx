
import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import { Target, Users, Award, Factory, Globe } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import DOMPurify from 'dompurify';

const About: React.FC = () => {
    const { companyInfo, aboutData, aboutBanners } = useGlobalContext();

  return (
    <div className="pt-0 pb-0 min-h-screen bg-white">

      {/* Banner */}
      <BannerCarousel banners={aboutBanners} />

      {/* Mission Statement (driven by admin aboutData) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                {aboutData?.missionTitle}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
                    {aboutData?.missionSubtitle}
                </span>
            </h2>
        </div>
      </section>

      {/* Company Profile - Split Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="relative sticky top-24">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img src="https://picsum.photos/seed/office_modern/800/1000" alt="About XELNS" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                            <div className="flex items-center gap-4 text-white">
                                <Factory size={32} className="text-brand-400" />
                                <div>
                                    <p className="font-bold text-lg">自设工厂</p>
                                    <p className="text-xs text-gray-300">拥有标签模切、碳带分切等多条专业生产线</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">关于鑫隆盛</h3>
                    <div className="w-20 h-1.5 bg-brand-600 mb-8"></div>
                    
                    {/* Dynamic Content driven by aboutData */}
                    <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                        {aboutData ? (
                            <div>
                              <h4 className="font-bold text-xl">{aboutData.missionTitle}</h4>
                              <p className="text-lg text-gray-700 mb-4">{aboutData.missionSubtitle}</p>
                              {(() => {
                                const text = aboutData.missionText || '';
                                const hasHtml = /<[^>]+>/.test(text);
                                return hasHtml ? (
                                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text, { ADD_ATTR: ['target'] }) }} />
                                ) : (
                                  <p className="text-gray-600">{text}</p>
                                );
                              })()}
                            </div>
                        ) : (
                            <p>惠州市鑫隆盛科技有限公司是一家专业致力于条码自动识别技术研究、开发和应用的高科技企业。</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-10">
                        {(aboutData?.stats || []).map((s, idx) => (
                          <div key={idx} className="border-l-4 border-brand-500 pl-4">
                            <h4 className="font-bold text-gray-900 text-xl">{s.value}</h4>
                            <p className="text-gray-500 text-sm">{s.label}</p>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Core Advantages - Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的核心优势</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    我们承诺为您提供最具竞争力的产品与服务，成就您的商业价值。
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(aboutData?.advantages || []).map((item: any, idx: number) => (
                    <div key={idx} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                            <Target size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-4">{item.en}</p>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Corporate Culture / Philosophy */}
      <section className="py-24 bg-brand-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-8">企业文化与理念</h2>
                      <div className="space-y-8">
                          <div className="flex gap-6">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center border border-brand-500">
                                  <span className="font-bold text-xl">诚</span>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">真诚以待 (Sincerity)</h3>
                                  <p className="text-brand-100 font-light">
                                      重视每一位客户，无论订单大小。尊重客户需求，以热情的态度和真诚的服务赢得信任。
                                  </p>
                              </div>
                          </div>
                          <div className="flex gap-6">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center border border-brand-500">
                                  <span className="font-bold text-xl">效</span>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">高效服务 (Efficiency)</h3>
                                  <p className="text-brand-100 font-light">
                                      急客户之所急。24小时快速响应机制，全程跟踪订单进度与售后问题，确保业务零延误。
                                  </p>
                              </div>
                          </div>
                          <div className="flex gap-6">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center border border-brand-500">
                                  <span className="font-bold text-xl">专</span>
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold mb-2">专业技术 (Professionalism)</h3>
                                  <p className="text-brand-100 font-light">
                                      术业有专攻。不断钻研前沿条码技术，提供专业、精准、可落地的技术支持与解决方案。
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-brand-700">
                      <img src="https://picsum.photos/seed/team_meeting/800/1000" alt="Team Work" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 max-w-xs text-center">
                              <Globe size={48} className="mx-auto mb-4 text-brand-300" />
                              <h4 className="text-2xl font-bold mb-2">连接未来</h4>
                              <p className="text-sm text-brand-100">Connecting Future with Barcode Technology</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Factory / Capabilities Gallery */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">生产与研发实力</h2>
                <p className="mt-4 text-gray-600">自有工厂与先进设备，保障品质与交期</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(aboutData?.galleryImages || []).map((g: any, idx: number) => (
                  <div key={idx} className="relative group overflow-hidden rounded-xl h-64">
                      <img src={g.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Gallery ${idx}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                          <div className="text-white">
                              {g.title && <div className="font-bold">{g.title}</div>}
                              {g.subtitle && <div className="text-sm opacity-90">{g.subtitle}</div>}
                          </div>
                      </div>
                  </div>
                ))}
            </div>
          </div>
      </section>

    </div>
  );
};

export default About;
