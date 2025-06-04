import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';    // ← this triggers Tailwind’s CSS build
import App from './App';
import netlifyIdentity from 'netlify-identity-widget';

// This will automatically detect your Netlify site and enable the Identity modal
netlifyIdentity.init();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

