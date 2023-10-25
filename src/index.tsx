import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Test-2';

const root = document.getElementById('root');
if(root) {
    createRoot(root).render(<App />);
}