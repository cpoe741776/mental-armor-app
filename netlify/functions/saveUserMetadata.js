// netlify/functions/saveUserMetadata.js
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

  const userId = identity.sub;

  // 2. Parse incoming JSON (it may contain visitedSkills and/or mfaScores)
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const metadataUpdates = {};
  if (payload.visitedSkills     !== undefined) metadataUpdates.visitedSkills = payload.visitedSkills;
  if (payload.mfaScores         !== undefined) metadataUpdates.mfaScores     = payload.mfaScores;

  // 3. PATCH the user record with the new user_metadata
  try {
    const resp = await fetch(
      `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_metadata: metadataUpdates }),
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Error patching user metadata:', text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not update user metadata' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User metadata updated' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error' }),
    };
  }
};
