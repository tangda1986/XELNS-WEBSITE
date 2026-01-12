
import React, { useState } from 'react';
import { storage } from '../../lib/storage';
import { useGlobalContext } from '../../context/GlobalContext';
import { Lock, Save, Database, UploadCloud, RotateCcw, Upload, Download, Activity, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const { showToast, initCloudDb, syncFromCloud, syncToCloud, isCloudSyncing } = useGlobalContext();
  const [importing, setImporting] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleInitDb = async () => {
    if (!confirm('确定要重置本地数据文件吗？这将清空 data/site_data.json 的内容。')) return;
    const ok = await initCloudDb();
    if (ok) showToast('本地文件重置成功');
    else showToast('本地文件重置失败');
  };

  const handleSyncToCloud = async () => {
    if (!confirm('确定要将当前数据保存到本地文件吗？')) return;
    await syncToCloud();
  };

  const handleSyncFromCloud = async () => {
    if (!confirm('确定要从本地文件重新读取数据吗？未保存的修改将丢失。')) return;
    await syncFromCloud();
  };

  const handleTestConnection = async () => {
    try {
      const res = await fetch(`/api/store?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        const keyCount = Object.keys(data || {}).length;
        alert(`连接成功！\n状态码: ${res.status}\n数据条数: ${keyCount}\nAPI工作正常。`);
      } else {
        const text = await res.text();
        alert(`连接失败！\n状态码: ${res.status}\n错误信息: ${text.slice(0, 200)}`);
      }
    } catch (e: any) {
      alert(`网络请求错误: ${e.message}`);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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
    await syncToCloud();
    showToast('密码修改成功！已同步到云端。');
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

  const handleGenerateStatic = async () => {
    try {
      setGenerating(true);
      const snapshot = storage.getStateSnapshot();
      const res = await fetch('http://localhost:8787/generate-static', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });
      if (!res.ok) {
        throw new Error('failed');
      }
      const data = await res.json();
      if (data && data.outDir) {
        showToast(`静态站点已生成：${data.outDir}`);
      } else {
        showToast('生成完成');
      }
    } catch {
      alert('生成失败：请先在终端运行 npm run admin:api');
    } finally {
      setGenerating(false);
    }
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

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-8 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
           <UploadCloud size={20} className="text-brand-600" />
           生成静态站点
        </h3>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleGenerateStatic}
            disabled={generating}
            className={`px-4 py-2 ${generating ? 'bg-gray-300 text-gray-600' : 'bg-brand-600 text-white'} rounded font-bold hover:bg-brand-700 flex items-center gap-2`}
          >
            <UploadCloud size={18} /> {generating ? '生成中...' : '生成静态站点'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">需要本地API已启动：npm run admin:api。</p>
      </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Database size={20} className="text-brand-600" />
            本地数据文件管理
          </h3>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
            <p className="font-bold mb-2">工作流程说明：</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>在此处点击“保存数据到本地文件”，数据将写入项目中的 <code>data/site_data.json</code> 文件。</li>
              <li>确认数据保存无误后，使用 Git 工具将代码提交并推送到 GitHub。</li>
              <li>Vercel 会自动检测到 GitHub 更新并重新部署网站，届时所有访问者将看到最新数据。</li>
              <li>注意：线上网站（Vercel）为只读模式，无法直接保存数据，必须通过本地修改推送的方式更新。</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">数据读写操作</h4>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSyncToCloud}
                  disabled={isCloudSyncing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  <Upload size={18} />
                  {isCloudSyncing ? '保存中...' : '保存数据到本地文件'}
                </button>
                <p className="text-xs text-gray-500">
                  将当前浏览器中的管理数据写入本地 JSON 文件。
                </p>

                <button
                  onClick={handleSyncFromCloud}
                  disabled={isCloudSyncing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <Download size={18} />
                  {isCloudSyncing ? '读取中...' : '从本地文件读取数据'}
                </button>
                <p className="text-xs text-gray-500">
                  从本地 JSON 文件加载数据到当前编辑器（会覆盖未保存的修改）。
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">连接测试</h4>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleTestConnection}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Activity size={18} />
                  测试文件读写权限
                </button>
                
                <button
                  onClick={handleInitDb}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw size={18} />
                  重置/初始化本地文件
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Settings;
