
import React from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Mail, Phone, Trash2, CheckCircle } from 'lucide-react';

const MessageInbox: React.FC = () => {
  const { messages, deleteMessage, markMessageRead } = useGlobalContext();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">留言信箱</h1>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl text-gray-400">
          暂无留言信息
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${msg.read ? 'border-gray-200 opacity-80' : 'border-brand-200 ring-1 ring-brand-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    {msg.name}
                    {!msg.read && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">{msg.date}</div>
                </div>
                <div className="flex gap-2">
                   {!msg.read && (
                     <button onClick={() => markMessageRead(msg.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="标记为已读">
                       <CheckCircle size={20} />
                     </button>
                   )}
                   <button onClick={() => deleteMessage(msg.id)} className="p-2 text-red-400 hover:bg-red-50 rounded" title="删除">
                     <Trash2 size={20} />
                   </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mb-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
                 <div className="flex items-center gap-2">
                   <Phone size={16} />
                   <a href={`tel:${msg.phone}`} className="hover:text-brand-600">{msg.phone}</a>
                 </div>
                 <div className="flex items-center gap-2">
                   <Mail size={16} />
                   <a href={`mailto:${msg.email}`} className="hover:text-brand-600">{msg.email}</a>
                 </div>
              </div>

              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageInbox;
