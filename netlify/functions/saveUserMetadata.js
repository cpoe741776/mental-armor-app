// netlify/functions/saveUserMetadata.js
const fetch      = require('node-fetch');
const { Buffer } = require('buffer');

exports.handler = async (event, context) => {
  // Debug logging
  console.log('▶ saveUserMetadata invoked');
  console.log('▶ event.httpMethod:', event.httpMethod);
  console.log('▶ context.clientContext.identity:', context.clientContext?.identity);
  console.log('▶ NETLIFY_IDENTITY_URL:', process.env.NETLIFY_IDENTITY_URL);
  console.log('▶ NETLIFY_IDENTITY_TOKEN:', process.env.NETLIFY_IDENTITY_TOKEN ? '<<present>>' : '<<missing>>');

  // 1. Verify the user is logged in and we have a JWT
  const identity = context.clientContext?.identity;
  if (!identity?.token) {
    console.error('‼ saveUserMetadata: Not authenticated or missing token');
    return { statusCode: 401, body: JSON.stringify({ error: 'Not authenticated' }) };
  }

  // 2. Decode the JWT to extract the "sub" claim (the Netlify user ID)
  let userId;
  try {
    const payload = identity.token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    userId = decoded.sub;
    console.log('▶ saveUserMetadata: decoded userId =', userId);
  } catch (err) {
    console.error('‼ saveUserMetadata: Error decoding token', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  // 3. Parse the incoming JSON body
  let bodyData;
  try {
    bodyData = JSON.parse(event.body);
    console.log('▶ saveUserMetadata: parsed body =', bodyData);
  } catch (err) {
    console.error('‼ saveUserMetadata: Invalid JSON body', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  // 4. Build the metadata updates object
  const updates = {};
  if (bodyData.visitedSkills !== undefined) updates.visitedSkills = bodyData.visitedSkills;
  if (bodyData.mfaScores     !== undefined) updates.mfaScores     = bodyData.mfaScores;
  console.log('▶ saveUserMetadata: metadata updates =', updates);

  // 5. Send the PATCH to the Netlify Identity Admin API
  try {
    const url = `${process.env.NETLIFY_IDENTITY_URL}/admin/users/${encodeURIComponent(userId)}`;
    console.log('▶ saveUserMetadata: PATCHing to', url);

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_IDENTITY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_metadata: updates }),
    });

    console.log('▶ saveUserMetadata: Admin API status =', resp.status);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('‼ saveUserMetadata: Admin API error body =', text);
      return { statusCode: resp.status, body: JSON.stringify({ error: 'Could not update user metadata' }) };
    }

    console.log('▶ saveUserMetadata: update successful');
    return { statusCode: 200, body: JSON.stringify({ message: 'User metadata updated' }) };
  } catch (err) {
    console.error('‼ saveUserMetadata: Caught exception', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected error' }) };
  }
};
