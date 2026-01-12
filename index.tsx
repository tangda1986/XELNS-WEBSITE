import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DOMPurify from 'dompurify';

// 配置 DOMPurify 安全钩子
// 防止 Reverse Tabnabbing 漏洞：当 target="_blank" 时自动添加 rel="noopener noreferrer"
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node instanceof Element && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);