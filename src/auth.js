// src/auth.js
import GoTrue from 'gotrue-js'

// Create and export a single auth client instance
export const auth = new GoTrue({
  // This must match your Netlify site’s Identity endpoint:
  APIUrl: `${window.location.origin}/.netlify/identity`,
  // Tells GoTrue to set a cookie with the JWT on login
  setCookie: true,
})