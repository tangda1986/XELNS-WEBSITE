
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Solution } from '../../types';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageInput from '../../components/admin/ImageInput';

const ICON_OPTIONS = ['Box', 'Layers', 'Award', 'ScanBarcode', 'Settings', 'MonitorCheck', 'Headphones'];

const SolutionManager: React.FC = () => {
  const { solutions, setSolutions } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<Partial<Solution>>({});

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个解决方案吗？')) {
      setSolutions(solutions.filter(s => s.id !== id));
    }
  };

  const handleEdit = (sol: Solution) => {
    setCurrentSolution(sol);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentSolution({
      id: `sol_${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Box',
      content: '<p>请输入解决方案详情...</p>',
      image: '',
      pinned: false,
      createdAt: Date.now()
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSolution.id || !currentSolution.title) return;

    const newSol = { pinned: false, createdAt: Date.now(), ...currentSolution } as Solution;
    const exists = solutions.find(s => s.id === newSol.id);
    
    if (exists) {
      setSolutions(solutions.map(s => s.id === newSol.id ? newSol : s));
    } else {
      setSolutions([newSol, ...solutions]);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{solutions.find(s => s.id === currentSolution.id) ? '编辑解决方案' : '新增解决方案'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input 
              className="w-full border rounded p-2" 
              value={currentSolution.title} 
              onChange={e => setCurrentSolution({...currentSolution, title: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">图标 (Icon)</label>
               <select 
                 className="w-full border rounded p-2"
                 value={currentSolution.iconName}
                 onChange={e => setCurrentSolution({...currentSolution, iconName: e.target.value})}
               >
                 {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
               </select>
             </div>
          </div>

          <div>
            <ImageInput 
              label="方案主图 (列表页显示)"
              value={currentSolution.image || ''}
              onChange={(val) => setCurrentSolution({...currentSolution, image: val})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">简短描述</label>
            <textarea 
               className="w-full border rounded p-2" 
               rows={3}
               value={currentSolution.desc} 
               onChange={e => setCurrentSolution({...currentSolution, desc: e.target.value})}
            />
          </div>

          <div>
            <label className="inline-flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={!!currentSolution.pinned}
                onChange={e => setCurrentSolution({ ...currentSolution, pinned: e.target.checked })}
              />
              置顶
            </label>
          </div>

          <RichTextEditor 
            label="解决方案详情 (富文本)" 
            value={currentSolution.content || ''} 
            onChange={(val) => setCurrentSolution({...currentSolution, content: val})} 
          />

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
        <h1 className="text-2xl font-bold text-gray-900">解决方案管理</h1>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm">
          <Plus size={18} /> 新增
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">标题</th>
              <th className="p-4 font-medium text-gray-500">图标</th>
              <th className="p-4 font-medium text-gray-500">描述</th>
              <th className="p-4 font-medium text-gray-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...solutions]
              .sort((a, b) => ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) || ((b.createdAt || 0) - (a.createdAt || 0)))
              .map(sol => (
              <tr key={sol.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{sol.title}</td>
                <td className="p-4 text-gray-500">{sol.iconName}</td>
                <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{sol.desc}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${sol.pinned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>{sol.pinned ? '置顶' : '普通'}</span>
                    <button onClick={() => handleEdit(sol)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(sol.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
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

export default SolutionManager;
