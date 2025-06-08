// src/index.js
import netlifyIdentity from 'netlify-identity-widget'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// 1. Initialize Netlify Identity immediately
netlifyIdentity.init()

// 2. If the URL hash contains a recovery_token, launch the Reset form
if (window.location.hash.includes('recovery_token=')) {
  netlifyIdentity.open()  
  // The widget will show its “Enter new password” view and strip the token
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
