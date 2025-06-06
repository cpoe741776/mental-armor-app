// netlify/functions/saveUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Ensure the request is from a logged-in user
  const identity = context.clientContext?.identity;
  if (!identity?.token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // Parse incoming JSON body
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const updates = {};
  if (payload.visitedSkills !== undefined) updates.visitedSkills = payload.visitedSkills;
  if (payload.mfaScores     !== undefined) updates.mfaScores     = payload.mfaScores;

  // PATCH user_metadata on the /user endpoint
  try {
    const resp = await fetch(
      `${identity.url}/user`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_metadata: updates }),
      }
    );
    if (!resp.ok) {
      const errorText = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: errorText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'User metadata updated' }) };
  } catch (err) {
    console.error('saveUserMetadata error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
// netlify/functions/saveUserMetadata.js


exports.handler = async (event, context) => {
  // 1. Ensure the request is from a logged‐in user
  const token = context.clientContext?.identity?.token;
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // 2. Parse the JSON payload
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // 3. Build updates
  const updates = {};
  if (data.visitedSkills !== undefined) updates.visitedSkills = data.visitedSkills;
  if (data.mfaScores     !== undefined) updates.mfaScores     = data.mfaScores;

  // 4. Send the PUT to /user
  try {
    const resp = await fetch(`${context.clientContext.identity.url}/user`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_metadata: updates }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: err }) };
    }
    return { statusCode: 200, body: JSON.stringify({ message: 'User metadata updated' }) };
  } catch (err) {
    console.error('saveUserMetadata error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
