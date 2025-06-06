

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// src/index.js
import netlifyIdentity from 'netlify-identity-widget'
import 'netlify-identity-widget/styles.css'

// Initialize Netlify Identity as early as possible
netlifyIdentity.init()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
