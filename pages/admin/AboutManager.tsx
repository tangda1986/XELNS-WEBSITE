import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import ImageInput from '../../components/admin/ImageInput';
import RichTextEditor from '../../components/admin/RichTextEditor';

const AboutManager: React.FC = () => {
  const { aboutData, setAboutData, showToast } = useGlobalContext();
  const [data, setData] = useState<any>(aboutData);

  useEffect(() => {
    // migrate galleryImages if stored as string[] -> convert to objects
    const cloned = { ...aboutData } as any;
    if (cloned && Array.isArray(cloned.galleryImages) && cloned.galleryImages.length > 0) {
      if (typeof cloned.galleryImages[0] === 'string') {
        cloned.galleryImages = cloned.galleryImages.map((img: string) => ({ image: img, title: '', subtitle: '' }));
      }
    } else if (!cloned.galleryImages) {
      cloned.galleryImages = [];
    }
    if (!cloned.cultureItems) cloned.cultureItems = [];
    setData(cloned);
  }, [aboutData]);

  const handleChange = (field: string, val: any) => setData({ ...data, [field]: val });

  const moveGallery = (index: number, dir: 'up' | 'down') => {
    const arr = [...(data.galleryImages || [])];
    const to = dir === 'up' ? index - 1 : index + 1;
    if (to < 0 || to >= arr.length) return;
    const tmp = arr[to]; arr[to] = arr[index]; arr[index] = tmp;
    handleChange('galleryImages', arr);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAboutData(data);
    showToast('关于页面已保存！');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">关于页面管理</h1>
      <form onSubmit={handleSave} className="space-y-6 max-w-6xl">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">使命标题</label>
          <input className="w-full border rounded p-2" value={data.missionTitle} onChange={e => handleChange('missionTitle', e.target.value)} />
          <label className="block text-sm font-medium my-2">使命副标题</label>
          <input className="w-full border rounded p-2" value={data.missionSubtitle} onChange={e => handleChange('missionSubtitle', e.target.value)} />
          <label className="block text-sm font-medium my-2">使命文本</label>
          <RichTextEditor value={data.missionText} onChange={(val) => handleChange('missionText', val)} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">公司简介图片</label>
          <ImageInput value={data.profileImage || ''} onChange={(v) => handleChange('profileImage', v)} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">统计数字 (value / label)</label>
          <div className="space-y-3">
            {(data.stats || []).map((s: any, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input className="w-32 border rounded p-2" value={s.value} onChange={e => {
                  const stats = [...data.stats]; stats[idx].value = e.target.value; handleChange('stats', stats);
                }} />
                <input className="flex-1 border rounded p-2" value={s.label} onChange={e => {
                  const stats = [...data.stats]; stats[idx].label = e.target.value; handleChange('stats', stats);
                }} />
                <button type="button" className="text-red-500" onClick={() => { const stats = data.stats.filter((_:any,i:number)=>i!==idx); handleChange('stats', stats); }}>删除</button>
              </div>
            ))}
            <button type="button" className="text-sm text-brand-600" onClick={() => handleChange('stats', [...(data.stats||[]), { value: '0', label: '' }])}>+ 添加统计</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">核心优势</label>
          <div className="space-y-4">
            {(data.advantages || []).map((a:any, idx:number) => (
              <div key={idx} className="border p-3 rounded">
                <input className="w-full border rounded p-2 mb-2" value={a.title} onChange={e => { const adv = [...data.advantages]; adv[idx].title = e.target.value; handleChange('advantages', adv); }} placeholder="标题" />
                <input className="w-full border rounded p-2 mb-2" value={a.en} onChange={e => { const adv = [...data.advantages]; adv[idx].en = e.target.value; handleChange('advantages', adv); }} placeholder="英文短语" />
                <textarea className="w-full border rounded p-2" rows={2} value={a.desc} onChange={e => { const adv = [...data.advantages]; adv[idx].desc = e.target.value; handleChange('advantages', adv); }} placeholder="描述" />
                <div className="flex justify-end mt-2"><button type="button" className="text-red-500" onClick={() => { const adv = data.advantages.filter((_:any,i:number)=>i!==idx); handleChange('advantages', adv); }}>删除</button></div>
              </div>
            ))}
            <button type="button" className="text-sm text-brand-600" onClick={() => handleChange('advantages', [...(data.advantages||[]), { title: '', en: '', desc: '' }])}>+ 添加优势项</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">企业文化与理念</label>
          <input className="w-full border rounded p-2 mb-3" value={data.cultureTitle || ''} onChange={e => handleChange('cultureTitle', e.target.value)} placeholder="文化区标题（可选）" />
          <textarea className="w-full border rounded p-2 mb-3" rows={3} value={data.cultureDescription || ''} onChange={e => handleChange('cultureDescription', e.target.value)} placeholder="文化区描述（可选）" />
          <div className="space-y-3">
            {(data.cultureItems || []).map((ci:any, idx:number) => (
              <div key={idx} className="border p-3 rounded">
                <input className="w-20 border rounded p-2 mb-2" value={ci.keyChar || ''} onChange={e => { const arr = [...data.cultureItems]; arr[idx].keyChar = e.target.value; handleChange('cultureItems', arr); }} placeholder="字" />
                <input className="w-full border rounded p-2 mb-2" value={ci.title} onChange={e => { const arr = [...data.cultureItems]; arr[idx].title = e.target.value; handleChange('cultureItems', arr); }} placeholder="标题" />
                <textarea className="w-full border rounded p-2" rows={2} value={ci.desc} onChange={e => { const arr = [...data.cultureItems]; arr[idx].desc = e.target.value; handleChange('cultureItems', arr); }} placeholder="描述" />
                <div className="flex justify-end mt-2"><button type="button" className="text-red-500" onClick={() => { const arr = data.cultureItems.filter((_:any,i:number)=>i!==idx); handleChange('cultureItems', arr); }}>删除</button></div>
              </div>
            ))}
            <button type="button" className="text-sm text-brand-600" onClick={() => handleChange('cultureItems', [...(data.cultureItems||[]), { keyChar: '', title: '', desc: '' }])}>+ 添加文化项</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium mb-2">工厂 / 画册图片 (Gallery)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(data.galleryImages||[]).map((g:any, idx:number) => (
              <div key={idx} className="bg-gray-50 p-2 rounded relative">
                <ImageInput value={g.image || ''} onChange={(v) => { const arr = [...data.galleryImages]; arr[idx] = { ...(arr[idx]||{}), image: v }; handleChange('galleryImages', arr); }} />
                <input className="w-full border rounded p-2 mt-2" value={g.title || ''} onChange={e => { const arr = [...data.galleryImages]; arr[idx] = { ...(arr[idx]||{}), title: e.target.value }; handleChange('galleryImages', arr); }} placeholder="图片标题（可选）" />
                <input className="w-full border rounded p-2 mt-2" value={g.subtitle || ''} onChange={e => { const arr = [...data.galleryImages]; arr[idx] = { ...(arr[idx]||{}), subtitle: e.target.value }; handleChange('galleryImages', arr); }} placeholder="图片副标题（可选）" />
                <div className="flex gap-2 mt-2">
                  <button type="button" className="text-sm text-brand-600" onClick={() => moveGallery(idx, 'up')}>上移</button>
                  <button type="button" className="text-sm text-brand-600" onClick={() => moveGallery(idx, 'down')}>下移</button>
                  <button type="button" className="ml-auto text-red-500" onClick={() => { const g2 = data.galleryImages.filter((_:any,i:number)=>i!==idx); handleChange('galleryImages', g2); }}>删除</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4"><button type="button" className="text-sm text-brand-600" onClick={() => handleChange('galleryImages', [...(data.galleryImages||[]), { image: '', title: '', subtitle: '' }])}>+ 添加图片</button></div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold">保存关于页面</button>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;
