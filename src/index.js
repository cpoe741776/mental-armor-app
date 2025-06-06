// src/index.js
import netlifyIdentity from 'netlify-identity-widget'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Initialize Netlify Identity as early as possible
netlifyIdentity.init()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
