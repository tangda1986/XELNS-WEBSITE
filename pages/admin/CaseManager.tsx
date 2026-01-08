import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { CustomerCase } from '../../types';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import ImageInput from '../../components/admin/ImageInput';
import RichTextEditor from '../../components/admin/RichTextEditor';

const CaseManager: React.FC = () => {
  const { customerCases, setCustomerCases, showToast } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState<Partial<CustomerCase>>({});

  const handleAdd = () => {
    setCurrent({
      id: `case_${Date.now()}`,
      title: '',
      desc: '',
      image: '',
      content: '<p>请输入案例详情...</p>',
      buttonText: '了解更多',
      buttonUrl: '#',
      pinned: false,
      createdAt: Date.now()
    });
    setIsEditing(true);
  };

  const handleEdit = (c: CustomerCase) => {
    setCurrent(c);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定删除该客户案例？')) return;
    setCustomerCases(customerCases.filter(c => c.id !== id));
    showToast('案例已删除');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { pinned: false, createdAt: Date.now(), ...current } as CustomerCase;
    if (!data.id || !data.title) return;
    const exists = customerCases.find(c => c.id === data.id);
    if (exists) {
      setCustomerCases(customerCases.map(c => c.id === data.id ? data : c));
    } else {
      setCustomerCases([data, ...customerCases]);
    }
    setIsEditing(false);
    showToast('案例已保存');
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{customerCases.find(c => c.id === current.id) ? '编辑客户案例' : '新增客户案例'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input className="w-full border rounded p-2" value={current.title || ''} onChange={e => setCurrent({ ...current, title: e.target.value })} required />
          </div>
          <div>
            <ImageInput label="案例主图" value={current.image || ''} onChange={val => setCurrent({ ...current, image: val })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">简短描述</label>
            <textarea className="w-full border rounded p-2" rows={3} value={current.desc || ''} onChange={e => setCurrent({ ...current, desc: e.target.value })} />
          </div>
          <RichTextEditor label="案例详情 (富文本)" value={current.content || ''} onChange={val => setCurrent({ ...current, content: val })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">按钮文案</label>
              <input className="w-full border rounded p-2" value={current.buttonText || ''} onChange={e => setCurrent({ ...current, buttonText: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">按钮链接</label>
              <input className="w-full border rounded p-2" value={current.buttonUrl || ''} onChange={e => setCurrent({ ...current, buttonUrl: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={!!current.pinned}
                onChange={e => setCurrent({ ...current, pinned: e.target.checked })}
              />
              置顶
            </label>
          </div>
          <div className="pt-4 flex gap-3 border-t">
            <button type="submit" className="px-8 py-2.5 bg-brand-600 text-white rounded font-bold hover:bg-brand-700 shadow-md">保存</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border rounded hover:bg-gray-50">取消</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">客户案例管理</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm">
          <Plus size={18} /> 新增
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">标题</th>
              <th className="p-4 font-medium text-gray-500">描述</th>
              <th className="p-4 font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...customerCases]
              .sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || ((b.createdAt || 0) - (a.createdAt || 0)))
              .map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{c.title}</td>
                <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{c.desc}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${c.pinned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>{c.pinned ? '置顶' : '普通'}</span>
                    <button onClick={() => handleEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseManager;
