// netlify/functions/getUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 1. Ensure the request is from a logged‐in user
  const token = context.clientContext?.identity?.token;
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // 2. Ask the Identity service for the current user
  try {
    const resp = await fetch(`${context.clientContext.identity.url}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) {
      const err = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: err }) };
    }

    const user = await resp.json();
    const visitedSkills = user.user_metadata?.visitedSkills || [];
    const mfaScores     = user.user_metadata?.mfaScores     || null;
    return { statusCode: 200, body: JSON.stringify({ visitedSkills, mfaScores }) };
  } catch (err) {
    console.error('getUserMetadata error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
