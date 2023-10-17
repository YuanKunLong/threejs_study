import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './3.GUI练习';

const root = document.getElementById('root');
if(root) {
    createRoot(root).render(<App />);
}