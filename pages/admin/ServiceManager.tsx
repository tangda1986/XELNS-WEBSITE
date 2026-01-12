import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Service, ServiceDetailData, ServiceTab, ServicePageData, ServiceProcessStep, MaintenanceItem } from '../../types';
import { Edit, Trash2, Plus, ChevronDown, ChevronRight, Save, Layout, List } from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';

const ServiceManager: React.FC = () => {
  const { 
    services, setServices, 
    serviceDetails, setServiceDetails,
    servicePageData, setServicePageData 
  } = useGlobalContext();
  
  const [activeTab, setActiveTab] = useState<'services' | 'page_content'>('services');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // --- Service List Management ---
  const handleAddService = () => {
    const id = `srv_${Date.now()}`;
    const newService: Service = { id, title: '新服务', description: '描述...', iconName: 'Settings' };
    const newDetail: ServiceDetailData = { title: '新服务详情', subtitle: 'Subtitle', tabs: [] };
    
    setServices([...services, newService]);
    setServiceDetails({ ...serviceDetails, [id]: newDetail });
    setSelectedServiceId(id);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('删除此服务将同时删除其所有详情页数据，确定吗？')) {
      setServices(services.filter(s => s.id !== id));
      const newDetails = { ...serviceDetails };
      delete newDetails[id];
      setServiceDetails(newDetails);
      if (selectedServiceId === id) setSelectedServiceId(null);
    }
  };

  const updateServiceBasic = (id: string, field: keyof Service, val: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  // --- Detail & Tabs Management ---
  const currentDetail = selectedServiceId ? serviceDetails[selectedServiceId] : null;

  const updateDetailHeader = (field: 'title' | 'subtitle', val: string) => {
    if (!selectedServiceId || !currentDetail) return;
    setServiceDetails({
      ...serviceDetails,
      [selectedServiceId]: { ...currentDetail, [field]: val }
    });
  };

  const addTab = () => {
    if (!selectedServiceId || !currentDetail) return;
    const newTab: ServiceTab = {
      id: `tab_${Date.now()}`,
      label: '新标签页',
      type: 'rich_text',
      items: [],
      content: ''
    };
    setServiceDetails({
      ...serviceDetails,
      [selectedServiceId]: { ...currentDetail, tabs: [...currentDetail.tabs, newTab] }
    });
  };

  const updateTab = (tabIndex: number, updatedTab: ServiceTab) => {
    if (!selectedServiceId || !currentDetail) return;
    const newTabs = [...currentDetail.tabs];
    newTabs[tabIndex] = updatedTab;
    setServiceDetails({
      ...serviceDetails,
      [selectedServiceId]: { ...currentDetail, tabs: newTabs }
    });
  };

  const removeTab = (tabIndex: number) => {
    if (!selectedServiceId || !currentDetail) return;
    if (!confirm('确定删除此标签页？')) return;
    const newTabs = currentDetail.tabs.filter((_, i) => i !== tabIndex);
    setServiceDetails({
      ...serviceDetails,
      [selectedServiceId]: { ...currentDetail, tabs: newTabs }
    });
  };

  // --- Page Content Management ---
  const updatePageData = (field: keyof ServicePageData, val: any) => {
    setServicePageData({ ...servicePageData, [field]: val });
  };

  const updateProcessStep = (idx: number, field: keyof ServiceProcessStep, val: any) => {
    const newSteps = [...servicePageData.processSteps];
    newSteps[idx] = { ...newSteps[idx], [field]: val };
    updatePageData('processSteps', newSteps);
  };

  const updateMaintenanceItem = (idx: number, val: string) => {
    const newItems = [...servicePageData.maintenanceItems];
    newItems[idx] = { ...newItems[idx], text: val };
    updatePageData('maintenanceItems', newItems);
  };

  const addMaintenanceItem = () => {
    const newItem: MaintenanceItem = { id: `m_${Date.now()}`, text: '新维护事项' };
    updatePageData('maintenanceItems', [...servicePageData.maintenanceItems, newItem]);
  };

  const removeMaintenanceItem = (idx: number) => {
    const newItems = servicePageData.maintenanceItems.filter((_, i) => i !== idx);
    updatePageData('maintenanceItems', newItems);
  };

  // --- Render ---

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">服务支持管理</h1>
        <button 
          onClick={() => {
            alert('所有更改已保存成功！');
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all"
        >
          <Save size={18} />
          保存所有更改
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
        <button 
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'services' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <List size={18} /> 服务项目列表
        </button>
        <button 
          onClick={() => setActiveTab('page_content')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'page_content' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Layout size={18} /> 页面内容配置
        </button>
      </div>

      {activeTab === 'services' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Service List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">服务列表</h3>
              <button onClick={handleAddService} className="text-sm bg-brand-600 text-white px-2 py-1 rounded flex items-center gap-1">
                <Plus size={14} /> 新增
              </button>
            </div>
            <div className="space-y-2">
              {services.map(srv => (
                <div 
                  key={srv.id} 
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${selectedServiceId === srv.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <input 
                      className="font-bold bg-transparent border-b border-transparent focus:border-brand-300 outline-none w-full mr-2"
                      value={srv.title}
                      onChange={(e) => updateServiceBasic(srv.id, 'title', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteService(srv.id); }} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <input 
                      className="text-xs text-gray-500 bg-transparent w-full outline-none"
                      value={srv.description}
                      onChange={(e) => updateServiceBasic(srv.id, 'description', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Details Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedServiceId && currentDetail ? (
              <>
                {/* Detail Header */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-bold border-b pb-2 mb-4">详情页头部信息</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">大标题</label>
                      <input className="w-full border rounded p-2" value={currentDetail.title} onChange={e => updateDetailHeader('title', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">副标题</label>
                      <input className="w-full border rounded p-2" value={currentDetail.subtitle} onChange={e => updateDetailHeader('subtitle', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Tabs Manager */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">内容标签页 (Tabs)</h3>
                    <button onClick={addTab} className="text-sm border border-brand-600 text-brand-600 px-3 py-1 rounded hover:bg-brand-50">添加标签页</button>
                  </div>

                  <div className="space-y-6">
                    {currentDetail.tabs.map((tab, idx) => (
                      <TabEditor 
                        key={tab.id} 
                        tab={tab} 
                        onUpdate={(t) => updateTab(idx, t)} 
                        onDelete={() => removeTab(idx)} 
                      />
                    ))}
                    {currentDetail.tabs.length === 0 && <p className="text-gray-400 text-center py-4">暂无内容，请添加标签页</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                请选择左侧服务进行编辑
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Page Content Editor */
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Service Process Config */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-6 border-b pb-2">流程区域配置</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">区域标题</label>
              <input 
                className="w-full border rounded p-2" 
                value={servicePageData.processTitle} 
                onChange={(e) => updatePageData('processTitle', e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">流程步骤 (固定6步)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicePageData.processSteps.map((step, idx) => (
                  <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                    <div className="text-brand-600 font-bold mb-2">步骤 0{step.step}</div>
                    <div className="space-y-2">
                      <input 
                        className="w-full border rounded p-2 text-sm" 
                        placeholder="标题" 
                        value={step.title}
                        onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                      />
                      <input 
                        className="w-full border rounded p-2 text-sm" 
                        placeholder="描述" 
                        value={step.desc}
                        onChange={(e) => updateProcessStep(idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Maintenance Config */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-6 border-b pb-2">维护保养区域配置</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">区域标题</label>
                <input 
                  className="w-full border rounded p-2" 
                  value={servicePageData.maintenanceTitle} 
                  onChange={(e) => updatePageData('maintenanceTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">右侧图片标题</label>
                <input 
                  className="w-full border rounded p-2" 
                  value={servicePageData.maintenanceImageTitle} 
                  onChange={(e) => updatePageData('maintenanceImageTitle', e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">右侧图片 URL</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 border rounded p-2" 
                  value={servicePageData.maintenanceImage} 
                  onChange={(e) => updatePageData('maintenanceImage', e.target.value)}
                />
                <div className="w-10 h-10 rounded border overflow-hidden flex-shrink-0">
                  <img src={servicePageData.maintenanceImage} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">维护事项列表</label>
                <button onClick={addMaintenanceItem} className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1">
                  <Plus size={12} /> 添加事项
                </button>
              </div>
              <div className="space-y-3">
                {servicePageData.maintenanceItems.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 mt-2 flex-shrink-0">{idx + 1}</div>
                    <textarea 
                      className="flex-1 border rounded p-2 text-sm" 
                      rows={2}
                      value={item.text}
                      onChange={(e) => updateMaintenanceItem(idx, e.target.value)}
                    />
                    <button onClick={() => removeMaintenanceItem(idx)} className="text-gray-400 hover:text-red-500 mt-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// Sub-component for editing a single Tab
const TabEditor: React.FC<{ tab: ServiceTab; onUpdate: (t: ServiceTab) => void; onDelete: () => void }> = ({ tab, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true);

  const handleAddItem = () => {
    const newItem = { title: '新项目', desc: '描述', url: '#', date: '', size: '', content: '' };
    onUpdate({ ...tab, items: [...(tab.items || []), newItem] });
  };

  const updateItem = (idx: number, field: string, val: string) => {
    const newItems = [...(tab.items || [])];
    newItems[idx] = { ...newItems[idx], [field]: val };
    onUpdate({ ...tab, items: newItems });
  };

  const deleteItem = (idx: number) => {
    const newItems = (tab.items || []).filter((_, i) => i !== idx);
    onUpdate({ ...tab, items: newItems });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 transition-all hover:bg-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <input 
            className="font-bold bg-transparent border-b border-dashed border-gray-400 w-1/3 outline-none focus:border-brand-500"
            value={tab.label}
            onChange={(e) => onUpdate({...tab, label: e.target.value})}
            onClick={(e) => e.stopPropagation()}
            placeholder="标签名称"
          />
          <select 
            className="text-xs border rounded p-1 ml-2"
            value={tab.type}
            onChange={(e) => onUpdate({...tab, type: e.target.value as any})}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="rich_text">富文本 (HTML)</option>
            <option value="video_list">视频列表</option>
            <option value="faq_list">FAQ 问答列表</option>
            <option value="download_list">下载列表</option>
          </select>
        </div>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
      </div>

      {expanded && (
        <div className="mt-4 pl-0 md:pl-6 border-l-2 border-transparent md:border-gray-300">
          {tab.type === 'rich_text' ? (
             <RichTextEditor 
                value={tab.content || ''} 
                onChange={(val) => onUpdate({...tab, content: val})} 
             />
          ) : (
            <div className="space-y-3">
               {(tab.items || []).map((item, i) => (
                 <div key={i} className="bg-white p-3 rounded border border-gray-200 relative group">
                    <button onClick={() => deleteItem(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-2 gap-2">
                       <input className="border p-1 text-sm rounded w-full font-bold" placeholder="标题" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} />
                       <input className="border p-1 text-sm rounded w-full" placeholder="链接/URL" value={item.url} onChange={e => updateItem(i, 'url', e.target.value)} />
                       
                       {tab.type === 'faq_list' ? (
                          <textarea className="border p-1 text-sm rounded w-full col-span-2" rows={2} placeholder="回答内容" value={item.content} onChange={e => updateItem(i, 'content', e.target.value)} />
                       ) : (
                          <textarea className="border p-1 text-sm rounded w-full col-span-2" rows={1} placeholder="描述" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
                       )}
                       
                       {tab.type === 'download_list' && <input className="border p-1 text-sm rounded w-full" placeholder="文件大小 (e.g. 5MB)" value={item.size} onChange={e => updateItem(i, 'size', e.target.value)} />}
                       {tab.type === 'video_list' && <input className="border p-1 text-sm rounded w-full" placeholder="日期" value={item.date} onChange={e => updateItem(i, 'date', e.target.value)} />}
                    </div>
                 </div>
               ))}
               <button onClick={handleAddItem} className="w-full py-2 border border-dashed rounded text-sm text-gray-500 hover:bg-white hover:text-brand-600 transition-colors">+ 添加条目</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceManager;