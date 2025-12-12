
import React, { useState } from 'react';
import { storage } from '../../lib/storage';
import { useGlobalContext } from '../../context/GlobalContext';
import { Lock, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { showToast } = useGlobalContext();
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
    </div>
  );
};

export default Settings;
