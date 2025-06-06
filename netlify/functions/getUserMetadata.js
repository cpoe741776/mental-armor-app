// netlify/functions/getUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Ensure the request is from a logged-in user
  const identity = context.clientContext?.identity;
  if (!identity?.token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // Fetch the currently authenticated user record
  try {
    const resp = await fetch(
      `${identity.url}/user`,
      {
        headers: {
          Authorization: `Bearer ${identity.token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) {
      const errorText = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: errorText }) };
    }

    const user = await resp.json();
    const visitedSkills = user.user_metadata?.visitedSkills || [];
    const mfaScores     = user.user_metadata?.mfaScores     || null;

    return {
      statusCode: 200,
      body: JSON.stringify({ visitedSkills, mfaScores }),
    };
  } catch (err) {
    console.error('getUserMetadata error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};