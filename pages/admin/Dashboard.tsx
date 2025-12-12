
import React from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Package, Image, Users, Layers } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products, solutions, services } = useGlobalContext();

  const stats = [
    { label: '在线产品', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: '解决方案', value: solutions.length, icon: Layers, color: 'bg-green-500' },
    { label: '服务项目', value: services.length, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className={`w-14 h-14 rounded-full ${stat.color} text-white flex items-center justify-center mr-4`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4">欢迎回来</h2>
        <p className="text-gray-600">
          您可以在此后台管理系统中完全控制前端显示的内容。所有更改将实时生效并保存到本地存储中。
          <br/>
          请从左侧菜单选择要管理的项目。
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
