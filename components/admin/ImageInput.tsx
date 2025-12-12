
import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// Helper to compress image
const compressImage = (source: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Resize to max 1920px (Full HD) to improve clarity on desktop
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
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Draw white background (for transparency handling if converting PNG to JPEG)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      // Use better interpolation for resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to JPEG at 85% quality (balanced for storage vs quality)
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = (e) => reject(e);

    // Load source
    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
};

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange, label }) => {
  const [mode, setMode] = useState<'url' | 'file' | 'ai'>('url');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressedBase64 = await compressImage(file);
        onChange(compressedBase64);
      } catch (error) {
        console.error("Compression error:", error);
        alert("图片处理失败，请重试");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('请输入图片描述');
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Using gemini-2.5-flash-image via generateContent
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });

      let rawBase64 = '';
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          rawBase64 = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (rawBase64) {
        // Compress the AI generated image before saving
        const compressed = await compressImage(rawBase64);
        onChange(compressed);
      } else {
        console.warn("No inlineData found in response:", response);
        alert('生成失败：未返回图片数据。请尝试修改提示词。');
      }

    } catch (error: any) {
      console.error("Image generation error:", error);
      let msg = 'AI生成服务暂时不可用。';
      if (error.status === 404 || error.code === 404) {
         msg = '模型未找到或暂不可用 (404)。请稍后重试。';
      } else if (error.message) {
         msg = `生成失败: ${error.message}`;
      }
      alert(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
        <button 
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap ${mode === 'url' ? 'bg-brand-100 text-brand-700 border border-brand-200 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <LinkIcon size={14} /> URL 地址
        </button>
        <button 
          type="button"
          onClick={() => setMode('file')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap ${mode === 'file' ? 'bg-brand-100 text-brand-700 border border-brand-200 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Upload size={14} /> 本地上传
        </button>
        <button 
          type="button"
          onClick={() => setMode('ai')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap ${mode === 'ai' ? 'bg-purple-100 text-purple-700 border border-purple-200 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Sparkles size={14} /> AI 生成
        </button>
      </div>

      {mode === 'url' && (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
          placeholder="https://example.com/image.jpg"
        />
      )}

      {mode === 'file' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative" onClick={() => !isCompressing && fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {isCompressing ? (
             <div className="flex flex-col items-center gap-2 text-brand-600">
               <Loader2 size={32} className="animate-spin" />
               <span className="text-sm font-medium">正在压缩图片...</span>
             </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-brand-600">
              <Upload size={32} />
              <span className="text-sm font-medium">点击选择图片 (高质量压缩)</span>
              <span className="text-xs text-gray-400">支持 JPG, PNG, WEBP</span>
            </div>
          )}
        </div>
      )}

      {mode === 'ai' && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-purple-800 mb-1">图片描述 (Prompt)</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm h-20 resize-none"
              placeholder="例如：一个现代化的自动化立体仓库，蓝色色调，高科技感，4k分辨率..."
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <label className="text-xs font-bold text-purple-800">比例:</label>
               <select 
                 value={aspectRatio}
                 onChange={(e) => setAspectRatio(e.target.value as any)}
                 className="text-xs border-purple-200 rounded px-2 py-1 focus:ring-purple-500 outline-none"
               >
                 <option value="16:9">16:9 (横幅/背景)</option>
                 <option value="4:3">4:3 (常规)</option>
                 <option value="1:1">1:1 (正方形/产品)</option>
               </select>
            </div>
            
            <button 
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-sm ${isGenerating ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-md'}`}
            >
              {isGenerating ? <><Loader2 size={16} className="animate-spin" /> 生成中...</> : <><Sparkles size={16} /> 开始生成</>}
            </button>
          </div>
          <p className="text-[10px] text-purple-600/70 text-right">Powered by Gemini 2.5 Flash Image</p>
        </div>
      )}

      {value && (
        <div className="relative mt-3 w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
           <img src={value} alt="Preview" className="w-full h-full object-contain" />
           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                    type="button"
                    onClick={() => onChange('')}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-105 transition-all"
                >
                    <X size={14} /> 清除图片
                </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
