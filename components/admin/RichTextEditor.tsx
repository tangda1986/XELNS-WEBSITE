
import React, { useRef } from 'react';
import { Bold, Italic, List, Heading, Link, Code, Image, AlignLeft, Check, Upload, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// Helper to compress image (duplicated from ImageInput to ensure self-containment)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        // Resize to max 1920px for better quality
        const MAX_SIZE = 1920;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
             resolve(e.target?.result as string); // Fallback to original
             return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG at 85% quality
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Measure image natural size
const measureImage = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [mode, setMode] = React.useState<'source' | 'wysiwyg'>('source');
  const wysiwygRef = useRef<HTMLDivElement>(null);
  const lastUpdateSourceRef = React.useRef<'wysiwyg' | 'source' | null>(null);
  React.useEffect(() => {
    if (mode === 'wysiwyg' && wysiwygRef.current) {
      if (lastUpdateSourceRef.current !== 'wysiwyg') {
        wysiwygRef.current.innerHTML = DOMPurify.sanitize(value || '');
        initResizableImages();
      }
      lastUpdateSourceRef.current = null;
    }
  }, [mode, value]);
  React.useEffect(() => {
    if (mode === 'source' && wysiwygRef.current) {
      const html = wysiwygRef.current.innerHTML;
      if (html !== undefined && html !== null) {
        onChange(DOMPurify.sanitize(html));
      }
    }
  }, [mode]);

  // 获取光标位置和选中文本
  const getSelectionInfo = () => {
    const textarea = textareaRef.current;
    if (!textarea) return null;
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: textarea.value,
      selectedText: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
    };
  };

  const focusWysiwyg = () => {
    wysiwygRef.current?.focus();
  };

  const syncFromWysiwyg = () => {
    const html = wysiwygRef.current?.innerHTML || '';
    lastUpdateSourceRef.current = 'wysiwyg';
    onChange(DOMPurify.sanitize(html));
  };

  const initResizableImages = () => {
    const root = wysiwygRef.current;
    if (!root) return;
    const figures = Array.from(root.querySelectorAll<HTMLElement>('figure.rte-img'));
    figures.forEach(fig => {
      if (fig.getAttribute('data-resize-init') === '1') return;
      fig.style.position = 'relative';
      fig.style.display = 'inline-block';
      const img = fig.querySelector<HTMLImageElement>('img');
      if (img) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        const applyWidth = (nw: number) => {
          const parentWidth = fig.parentElement ? fig.parentElement.getBoundingClientRect().width : (root?.getBoundingClientRect().width || nw || 400);
          const setWidth = Math.min(Math.max(nw || 400, 80), Math.round(parentWidth));
          img.style.width = `${setWidth}px`;
        };
        if (!img.style.width) {
          if (img.naturalWidth && img.naturalWidth > 0) {
            applyWidth(img.naturalWidth);
          } else {
            img.onload = () => applyWidth(img.naturalWidth || 400);
          }
        }
      }
      let handle = fig.querySelector<HTMLElement>('span.rte-resize-handle');
      if (!handle) {
        handle = document.createElement('span');
        handle.className = 'rte-resize-handle';
        handle.style.position = 'absolute';
        handle.style.width = '12px';
        handle.style.height = '12px';
        handle.style.right = '4px';
        handle.style.bottom = '4px';
        handle.style.background = '#4b5563';
        handle.style.borderRadius = '2px';
        handle.style.cursor = 'nwse-resize';
        handle.style.opacity = '0.7';
        handle.setAttribute('contenteditable', 'false');
        fig.appendChild(handle);
      }
      let resizing = false;
      let startX = 0;
      let startWidth = 0;
      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!img) return;
        resizing = true;
        startX = e.clientX;
        startWidth = img.getBoundingClientRect().width;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!resizing || !img) return;
        const delta = e.clientX - startX;
        let newWidth = Math.max(80, Math.round(startWidth + delta));
        const parentWidth = fig.parentElement ? fig.parentElement.getBoundingClientRect().width : fig.getBoundingClientRect().width;
        newWidth = Math.min(newWidth, Math.round(parentWidth));
        img.style.width = `${newWidth}px`;
      };
      const onMouseUp = () => {
        if (!resizing) return;
        resizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        syncFromWysiwyg();
      };
      handle.addEventListener('mousedown', onMouseDown);
      fig.setAttribute('data-resize-init', '1');
    });
  };

  const getSelectionTextInWysiwyg = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    return sel.toString();
  };

  const insertHTMLAtCursorWysiwyg = (html: string) => {
    focusWysiwyg();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      wysiwygRef.current && (wysiwygRef.current.innerHTML += html);
    } else {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node: ChildNode | null;
      while ((node = temp.firstChild)) {
        frag.appendChild(node);
      }
      range.insertNode(frag);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    syncFromWysiwyg();
    initResizableImages();
  };

  const execWysiwyg = (cmd: string, value?: string) => {
    focusWysiwyg();
    document.execCommand(cmd, false, value || undefined);
    syncFromWysiwyg();
  };

  // 插入标签 (包裹选中文本)
  const insertTag = (startTag: string, endTag: string = '') => {
    const info = getSelectionInfo();
    if (!info) return;
    const { start, end, text, selectedText } = info;
    
    // 修复 closing tag 生成逻辑: 去除首尾的 < > 符号后再分割
    const tagName = startTag.replace(/^[<]+|[>]+$/g, '').split(' ')[0];
    const eTag = endTag || (startTag.startsWith('<') && !startTag.includes('img') ? `</${tagName}>` : '');
    
    const replacement = `${startTag}${selectedText}${eTag}`;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);
    
    // 恢复焦点并选中新插入的内容
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 0);
  };

  // 在光标处直接插入内容 (不包裹)
  const insertAtCursor = (content: string) => {
     const info = getSelectionInfo();
     if (!info) return;
     const { start, end, text } = info;
     
     const newValue = text.substring(0, start) + content + text.substring(end);
     onChange(newValue);

     setTimeout(() => {
       textareaRef.current?.focus();
       const newCursorPos = start + content.length;
       textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
     }, 0);
  };

  // 处理链接插入
  const handleLinkInsert = () => {
    if (mode === 'wysiwyg') {
      const url = prompt('请输入链接 URL:', 'https://');
      if (!url) return;
      const selected = getSelectionTextInWysiwyg();
      if (selected) {
        execWysiwyg('createLink', url);
      } else {
        const linkText = prompt('请输入链接显示的文字:', '点击查看');
        if (linkText) {
          insertHTMLAtCursorWysiwyg(`<a href="${url}" class="text-brand-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
        }
      }
      return;
    }
    const info = getSelectionInfo();
    if (!info) return;

    const url = prompt('请输入链接 URL:', 'https://');
    if (!url) return;

    if (info.selectedText) {
      // 有选中文本，直接包裹
      insertTag(`<a href="${url}" class="text-brand-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">`, '</a>');
    } else {
      // 无选中文本，询问显示文字
      const linkText = prompt('请输入链接显示的文字:', '点击查看');
      if (linkText) {
        insertAtCursor(`<a href="${url}" class="text-brand-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
      }
    }
  };

  // 处理本地图片上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await compressImage(file);
        const { width: naturalWidth } = await measureImage(compressedBase64).catch(() => ({ width: 400, height: 300 }));
        const containerWidth = wysiwygRef.current?.getBoundingClientRect().width || 600;
        const setWidth = Math.min(Math.max(naturalWidth || 400, 80), Math.round(containerWidth));
        const styleAttr = `style="width:${setWidth}px;max-width:100%;height:auto"`;
        if (mode === 'wysiwyg') {
          insertHTMLAtCursorWysiwyg(`<figure class="rte-img my-6"><img src="${compressedBase64}" alt="Uploaded Image" ${styleAttr} class="rounded-lg shadow-md" /><span class="rte-resize-handle"></span></figure>`);
        } else {
          insertAtCursor(`<img src="${compressedBase64}" ${styleAttr} class="rounded-lg shadow-md my-6" alt="Uploaded Image" />`);
        }
      } catch (error) {
        console.error("Upload error", error);
        alert("图片上传失败");
      } finally {
        setIsUploading(false);
      }
    }
    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-500 transition-shadow">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b p-2 flex gap-1 flex-wrap items-center select-none">
           <ToolButton icon={Bold} onClick={() => mode === 'wysiwyg' ? execWysiwyg('bold') : insertTag('<b>', '</b>')} tooltip="加粗" />
           <ToolButton icon={Italic} onClick={() => mode === 'wysiwyg' ? execWysiwyg('italic') : insertTag('<i>', '</i>')} tooltip="斜体" />
           <div className="w-px h-5 bg-gray-300 mx-1"></div>
           
           <ToolButton icon={Heading} onClick={() => {
             if (mode === 'wysiwyg') {
               const selected = getSelectionTextInWysiwyg();
               if (selected) {
                 insertHTMLAtCursorWysiwyg(`<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">${selected}</h3>`);
               } else {
                 insertHTMLAtCursorWysiwyg('<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">标题</h3>');
               }
             } else {
               insertTag('<h3 class="text-xl font-bold mb-3 mt-6 text-gray-900">', '</h3>');
             }
           }} tooltip="标题 (H3)" />
           <ToolButton icon={AlignLeft} onClick={() => {
             if (mode === 'wysiwyg') {
               const selected = getSelectionTextInWysiwyg();
               if (selected) {
                 insertHTMLAtCursorWysiwyg(`<p class="mb-4 leading-relaxed text-gray-700">${selected}</p>`);
               } else {
                 insertHTMLAtCursorWysiwyg('<p class="mb-4 leading-relaxed text-gray-700">正文</p>');
               }
             } else {
               insertTag('<p class="mb-4 leading-relaxed text-gray-700">', '</p>');
             }
           }} tooltip="段落 (P)" />
           <div className="w-px h-5 bg-gray-300 mx-1"></div>
           
           <ToolButton icon={List} onClick={() => mode === 'wysiwyg' ? execWysiwyg('insertUnorderedList') : insertTag('<ul class="list-disc list-inside space-y-2 mb-4 text-gray-700">', '</ul>')} tooltip="无序列表" />
           <ToolButton icon={Check} onClick={() => {
             if (mode === 'wysiwyg') {
               insertHTMLAtCursorWysiwyg('<li>列表项</li>');
             } else {
               insertTag('<li>', '</li>');
             }
           }} tooltip="列表项" />
           <div className="w-px h-5 bg-gray-300 mx-1"></div>
           
           <ToolButton icon={Link} onClick={handleLinkInsert} tooltip="插入链接" />
           
           {/* Image URL Button */}
           <ToolButton icon={Image} onClick={() => {
              const url = prompt('请输入图片 URL 地址:');
              if (!url) return;
              const containerWidth = wysiwygRef.current?.getBoundingClientRect().width || 600;
              measureImage(url).then(({ width }) => {
                const setWidth = Math.min(Math.max(width || 400, 80), Math.round(containerWidth));
                const styleAttr = `style="width:${setWidth}px;max-width:100%;height:auto"`;
                if (mode === 'wysiwyg') {
                  insertHTMLAtCursorWysiwyg(`<figure class="rte-img my-6"><img src="${url}" alt="Image" ${styleAttr} class="rounded-lg shadow-md" /><span class="rte-resize-handle"></span></figure>`);
                } else {
                  insertAtCursor(`<img src="${url}" ${styleAttr} class="rounded-lg shadow-md my-6" alt="Image" />`);
                }
              }).catch(() => {
                if (mode === 'wysiwyg') {
                  insertHTMLAtCursorWysiwyg(`<figure class="rte-img my-6"><img src="${url}" alt="Image" style="width:400px;max-width:100%;height:auto" class="rounded-lg shadow-md" /><span class="rte-resize-handle"></span></figure>`);
                } else {
                  insertAtCursor(`<img src="${url}" class="rounded-lg shadow-md my-6" alt="Image" />`);
                }
              });
           }} tooltip="插入网络图片 (URL)" />
           
           {/* Image Upload Button */}
           <button 
             type="button"
             onClick={() => !isUploading && fileInputRef.current?.click()}
             title="上传本地图片"
             className="p-2 hover:bg-gray-200 rounded text-brand-600 hover:text-brand-700 transition-colors"
             onMouseDown={(e) => e.preventDefault()}
           >
             {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileUpload} 
             accept="image/*" 
             className="hidden" 
           />

           <div className="w-px h-5 bg-gray-300 mx-1"></div>
           <ToolButton icon={Code} onClick={() => {
             if (mode === 'wysiwyg') {
               insertHTMLAtCursorWysiwyg('<div class="bg-gray-100 p-4 rounded border">内容</div>');
             } else {
               insertTag('<div class="bg-gray-100 p-4 rounded border">', '</div>');
             }
           }} tooltip="灰色背景框" />
           
           <div className="ml-auto flex items-center gap-1">
             <button
               type="button"
               onClick={() => setMode('source')}
               className={`px-2 py-1 text-xs rounded ${mode === 'source' ? 'bg-brand-600 text-white' : 'hover:bg-gray-200 text-gray-700'}`}
             >
               源码
             </button>
             <button
               type="button"
               onClick={() => {
                 setMode('wysiwyg');
               }}
               className={`px-2 py-1 text-xs rounded ${mode === 'wysiwyg' ? 'bg-brand-600 text-white' : 'hover:bg-gray-200 text-gray-700'}`}
             >
               所见即所得
             </button>
           </div>
        </div>

        {mode === 'source' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { lastUpdateSourceRef.current = 'source'; onChange(e.target.value); }}
            className="w-full p-4 h-96 outline-none font-mono text-sm leading-relaxed resize-y"
            placeholder="在此输入内容... 使用上方工具栏辅助排版 (支持 HTML 代码)"
          />
        ) : (
          <div
            ref={wysiwygRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncFromWysiwyg}
            className="w-full p-4 h-96 outline-none text-sm leading-relaxed resize-y prose max-w-none overflow-auto"
            style={{ whiteSpace: 'pre-wrap' }}
          />
        )}
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
        <span>提示：点击“上传本地图片”按钮可直接插入图片(会自动压缩)。</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{mode === 'source' ? 'HTML 源码模式' : '所见即所得模式'}</span>
      </div>
    </div>
  );
};

// 辅助组件：工具栏按钮
const ToolButton = ({ icon: Icon, onClick, tooltip }: any) => (
  <button 
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()} // 关键：防止点击按钮时 textarea 失去焦点导致 selection 失效
    title={tooltip}
    className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-brand-700 transition-colors"
  >
    <Icon size={18} />
  </button>
);

export default RichTextEditor;
