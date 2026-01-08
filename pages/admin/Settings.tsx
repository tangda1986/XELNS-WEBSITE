
import React, { useState } from 'react';
import { storage } from '../../lib/storage';
import { useGlobalContext } from '../../context/GlobalContext';
import { Lock, Save, Database, UploadCloud, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const { showToast } = useGlobalContext();
  const [importing, setImporting] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentStoredPassword = storage.getAdminPassword();
    
    if (oldPassword !== currentStoredPassword) {
      setError('旧密码错误');
      return;
    }

    if (newPassword.length < 5) {
      setError('新密码长度不能少于 5 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }

    storage.saveAdminPassword(newPassword);
    showToast('密码修改成功！下次登录请使用新密码。');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExport = () => {
    const snapshot = storage.getStateSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xelns_backup_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('已导出当前数据快照 JSON');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImporting(true);
      const text = await file.text();
      const obj = JSON.parse(text);
      const ok = storage.importStateSnapshot(obj);
      if (ok) {
        showToast('数据已导入并覆盖当前配置');
        window.location.reload();
      } else {
        alert('导入失败：JSON结构不符合要求');
      }
    } catch (err) {
      alert('导入失败：文件无效或解析错误');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleReset = () => {
    if (!confirm('确认恢复为默认演示数据？此操作不可撤销。')) return;
    storage.resetToDefaults();
    showToast('已恢复默认数据');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">系统设置</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
           <Lock size={20} className="text-brand-600" />
           修改管理员密码
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">旧密码</label>
            <input 
              type="password"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
              value={oldPassword} 
              onChange={e => setOldPassword(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">新密码</label>
            <input 
              type="password"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">确认新密码</label>
            <input 
              type="password"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
            <Save size={18} /> 提交修改
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-8 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
           <Database size={20} className="text-brand-600" />
           数据备份与恢复
        </h3>
        <div className="flex flex-wrap gap-4 items-center">
          <button onClick={handleExport} className="px-4 py-2 bg-brand-600 text-white rounded font-bold hover:bg-brand-700 flex items-center gap-2">
            <UploadCloud size={18} /> 导出当前数据为 JSON
          </button>
          <label className="px-4 py-2 border rounded font-bold hover:bg-gray-50 cursor-pointer flex items-center gap-2">
            <UploadCloud size={18} /> 导入 JSON 覆盖
            <input type="file" accept="application/json" className="hidden" onChange={handleImportFile} disabled={importing} />
          </label>
          <button onClick={handleReset} className="px-4 py-2 bg-gray-100 text-gray-700 rounded font-bold hover:bg-gray-200 flex items-center gap-2">
            <RotateCcw size={18} /> 恢复默认演示数据
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">提示：所有内容（导航、页面数据、轮播、案例、服务详情等）均包含在导出文件中。</p>
      </div>
    </div>
  );
};

export default Settings;
