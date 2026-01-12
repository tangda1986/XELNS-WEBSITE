import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Product } from '../../types';
import { Edit, Trash2, Plus, X, QrCode } from 'lucide-react';
import ImageInput from '../../components/admin/ImageInput';
import RichTextEditor from '../../components/admin/RichTextEditor';

const ProductManager: React.FC = () => {
  const { products, setProducts } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个产品吗？')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      id: `p_${Date.now()}`,
      title: '',
      category: '打印设备',
      description: '',
      image: '',
      images: [],
      features: [],
      details: '<p>请输入详情...</p>'
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.id || !currentProduct.title) return;

    const newProd = currentProduct as Product;
    
    // Check if updating or creating
    const exists = products.find(p => p.id === newProd.id);
    if (exists) {
      setProducts(products.map(p => p.id === newProd.id ? newProd : p));
    } else {
      setProducts([...products, newProd]);
    }
    setIsEditing(false);
  };

  // Helper for multi-image input
  const handleAddCarouselImage = (url: string) => {
    if (!url) return;
    const currentImages = currentProduct.images || [];
    setCurrentProduct({ ...currentProduct, images: [...currentImages, url] });
  };

  const removeCarouselImage = (index: number) => {
    const currentImages = currentProduct.images || [];
    setCurrentProduct({ ...currentProduct, images: currentImages.filter((_, i) => i !== index) });
  };

  // 生成产品链接（假设部署后结构）
  const productLink = currentProduct.id 
    ? `${window.location.origin}${window.location.pathname}#/products/${currentProduct.id}`
    : '';
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(productLink)}`;

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{products.find(p => p.id === currentProduct.id) ? '编辑产品' : '新增产品'}</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left Column: Basic Info */}
             <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium mb-1">产品名称</label>
                     <input 
                       className="w-full border rounded p-2" 
                       value={currentProduct.title} 
                       onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})}
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">分类</label>
                     <select 
                       className="w-full border rounded p-2" 
                       value={currentProduct.category} 
                       onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                     >
                       <option>打印设备</option>
                       <option>数据采集</option>
                       <option>扫描设备</option>
                       <option>耗材</option>
                       <option>自动化</option>
                     </select>
                   </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">简短描述</label>
                  <textarea 
                     className="w-full border rounded p-2" 
                     rows={3}
                     value={currentProduct.description} 
                     onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  />
                </div>
             </div>
             
             {/* Right Column: QR Preview */}
             <div className="bg-gray-50 border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                 <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                   <QrCode size={16} /> 推广二维码
                 </h4>
                 {currentProduct.id ? (
                   <>
                     <div className="bg-white p-2 rounded shadow-sm border mb-2">
                       <img src={qrUrl} alt="QR" className="w-[100px] h-[100px]" />
                     </div>
                     <p className="text-xs text-gray-500">ID: {currentProduct.id}</p>
                     <a href={productLink} target="_blank" className="text-xs text-brand-600 hover:underline mt-1 block max-w-full truncate px-2">
                        预览链接
                     </a>
                   </>
                 ) : (
                   <div className="text-gray-400 text-sm py-8">保存后生成</div>
                 )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <ImageInput 
                  label="产品主图" 
                  value={currentProduct.image || ''} 
                  onChange={(val) => setCurrentProduct({...currentProduct, image: val})} 
                />
            </div>
            
            <div>
               <label className="block text-sm font-medium mb-2">轮播图列表</label>
               <div className="space-y-2 mb-2">
                 {(currentProduct.images || []).map((img, idx) => (
                   <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                      <img src={img} alt="" className="w-8 h-8 object-cover rounded" />
                      <span className="flex-1 text-xs truncate text-gray-500">{img.substring(0, 30)}...</span>
                      <button type="button" onClick={() => removeCarouselImage(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={14} /></button>
                   </div>
                 ))}
               </div>
               <div className="bg-gray-50 p-3 rounded border border-dashed">
                  <p className="text-xs text-gray-500 mb-2">添加新轮播图:</p>
                  <ImageInput 
                    value="" 
                    onChange={handleAddCarouselImage}
                  />
               </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">主要特点 (每行一个)</label>
             <textarea 
               className="w-full border rounded p-2"
               rows={4}
               value={currentProduct.features?.join('\n')}
               onChange={e => setCurrentProduct({...currentProduct, features: e.target.value.split('\n').filter(s => s.trim())})}
               placeholder="例如：坚固耐用"
             />
          </div>

          <RichTextEditor 
            label="产品详情 (富文本)" 
            value={currentProduct.details || ''} 
            onChange={(val) => setCurrentProduct({...currentProduct, details: val})} 
          />

          <div className="pt-4 flex gap-3 border-t">
            <button type="submit" className="px-8 py-2.5 bg-brand-600 text-white rounded font-bold hover:bg-brand-700 shadow-md">保存产品</button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border rounded hover:bg-gray-50">取消</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm">
          <Plus size={18} /> 新增产品
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500 w-24">图片</th>
              <th className="p-4 font-medium text-gray-500">名称</th>
              <th className="p-4 font-medium text-gray-500">分类</th>
              <th className="p-4 font-medium text-gray-500 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4 text-sm text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">{product.category}</span></td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="编辑"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="删除"><Trash2 size={18} /></button>
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

export default ProductManager;