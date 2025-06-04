// netlify/functions/getUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 1. Ensure the request is from a logged-in user
  const identity = context.clientContext?.identity;
  if (!identity) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  const userId = identity.sub; // e.g. "netlify|123abc..."

  // 2. Fetch the full user record using a Personal Access Token
  try {
    const resp = await fetch(
      `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      console.error('Error fetching user record:', text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not fetch user record' }),
      };
    }

    const user = await resp.json();
    const visitedSkills = user.user_metadata?.visitedSkills || [];
    const mfaScores     = user.user_metadata?.mfaScores || null;

    return {
      statusCode: 200,
      body: JSON.stringify({ visitedSkills, mfaScores }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error' }),
    };
  }
};
