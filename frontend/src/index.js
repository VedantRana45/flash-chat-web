import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './ContextApi/ChatProvider';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);


