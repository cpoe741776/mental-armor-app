// netlify/functions/getUserMetadata.js
const fetch = require('node-fetch');
const { Buffer } = require('buffer');

exports.handler = async (event, context) => {
  // Debug logging
  console.log('▶ getUserMetadata invoked');
  console.log('▶ event.httpMethod:', event.httpMethod);
  console.log('▶ context.clientContext.identity:', context.clientContext?.identity);
  console.log('▶ NETLIFY_IDENTITY_URL:', process.env.NETLIFY_IDENTITY_URL);
  console.log('▶ NETLIFY_IDENTITY_TOKEN:', process.env.NETLIFY_IDENTITY_TOKEN ? '<<present>>' : '<<missing>>');

  const identity = context.clientContext?.identity;
  if (!identity?.token) {
    console.error('‼ getUserMetadata: Not authenticated or missing token');
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // Decode the JWT to extract the "sub" (user ID)
  let userId;
  try {
    const token = identity.token;
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    userId = decoded.sub;
    console.log('▶ getUserMetadata: decoded userId =', userId);
  } catch (err) {
    console.error('‼ getUserMetadata: Error decoding token', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  // Fetch full user record from Netlify Identity Admin API
  try {
    const url = `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`;
    console.log('▶ getUserMetadata: fetching URL =', url);

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('▶ getUserMetadata: Admin API status =', resp.status);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('‼ getUserMetadata: Admin API error body =', text);
      return { statusCode: 500, body: JSON.stringify({ error: 'Could not fetch user record' }) };
    }

    const user = await resp.json();
    console.log('▶ getUserMetadata: user JSON =', JSON.stringify(user));
    const visitedSkills = user.user_metadata?.visitedSkills || [];
    const mfaScores     = user.user_metadata?.mfaScores     || null;
    console.log('▶ getUserMetadata: returning visitedSkills & mfaScores');

    return { statusCode: 200, body: JSON.stringify({ visitedSkills, mfaScores }) };
  } catch (err) {
    console.error('‼ getUserMetadata: Caught exception =', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
