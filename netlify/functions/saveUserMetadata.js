// netlify/functions/saveUserMetadata.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Debug logging
  console.log('▶ saveUserMetadata invoked');
  console.log('▶ event.httpMethod:', event.httpMethod);
  console.log('▶ context.clientContext.identity:', context.clientContext?.identity);
  console.log('▶ raw event.body:', event.body);
  console.log('▶ NETLIFY_IDENTITY_URL:', process.env.NETLIFY_IDENTITY_URL);
  console.log('▶ NETLIFY_IDENTITY_TOKEN:', process.env.NETLIFY_IDENTITY_TOKEN ? '<<present>>' : '<<missing>>');

  // 1. Ensure the request is from a logged-in user
  const identity = context.clientContext?.identity;
  if (!identity) {
    console.log('‼ saveUserMetadata: Not authenticated');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
  }

  const userId = identity.sub;
  console.log('▶ saveUserMetadata: userId =', userId);

  // 2. Parse incoming JSON (it may contain visitedSkills and/or mfaScores)
  let payload;
  try {
    payload = JSON.parse(event.body);
    console.log('▶ saveUserMetadata: parsed payload =', payload);
  } catch (parseErr) {
    console.error('‼ saveUserMetadata: Invalid JSON body', parseErr);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const metadataUpdates = {};
  if (payload.visitedSkills !== undefined) metadataUpdates.visitedSkills = payload.visitedSkills;
  if (payload.mfaScores     !== undefined) metadataUpdates.mfaScores     = payload.mfaScores;
  console.log('▶ saveUserMetadata: metadataUpdates =', metadataUpdates);

  // 3. PATCH the user record with the new user_metadata
  try {
    const url = `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`;
    console.log('▶ saveUserMetadata: PATCHing to URL =', url);

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_metadata: metadataUpdates }),
    });

    console.log('▶ saveUserMetadata: Admin API responded with status', resp.status);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('‼ saveUserMetadata: Error patching user metadata:', text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not update user metadata' }),
      };
    }

    console.log('▶ saveUserMetadata: successful update');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User metadata updated' }),
    };
  } catch (err) {
    console.error('‼ saveUserMetadata: Caught exception:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error' }),
    };
  }
};
