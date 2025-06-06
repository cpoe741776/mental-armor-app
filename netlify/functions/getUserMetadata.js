// netlify/functions/getUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('▶ getUserMetadata invoked');
  console.log('▶ context.clientContext.identity:', context.clientContext?.identity);
  console.log('▶ event.httpMethod:', event.httpMethod);

  // 1. Ensure the request is from a logged-in user
  const identity = context.clientContext?.identity;
  if (!identity) {
    console.log('‼ getUserMetadata: not authenticated (no identity)');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  const userId = identity.sub; // e.g. "netlify|123abc..."
  console.log('▶ getUserMetadata: userId =', userId);

  // 2. Fetch the full user record using a Personal Access Token
  try {
    const url = `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`;
    console.log('▶ getUserMetadata: fetching:', url);

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('▶ getUserMetadata: identity API responded with status', resp.status);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('‼ getUserMetadata: Error fetching user record body:', text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not fetch user record' }),
      };
    }

    const user = await resp.json();
    console.log('▶ getUserMetadata: raw user JSON:', user);

    const visitedSkills = user.user_metadata?.visitedSkills || [];
    const mfaScores     = user.user_metadata?.mfaScores || null;

    console.log('▶ getUserMetadata: returning visitedSkills & mfaScores');
    return {
      statusCode: 200,
      body: JSON.stringify({ visitedSkills, mfaScores }),
    };
  } catch (err) {
    console.error('‼ getUserMetadata caught exception:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error' }),
    };
  }
};
