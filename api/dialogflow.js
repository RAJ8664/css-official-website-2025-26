import dialogflowLib from '@google-cloud/dialogflow';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, isEvent } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const credentialsString = process.env.GOOGLE_CREDENTIALS_JSON || '{}';
    const credentials = JSON.parse(credentialsString);
    const projectId = process.env.GOOGLE_PROJECT_ID || 'whatever-ceyu';

    const sessionClient = new dialogflowLib.SessionsClient({
      credentials: credentials,
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: isEvent
        ? {
            event: {
              name: message,
              languageCode: 'en-US',
            },
          }
        : {
            text: {
              text: message,
              languageCode: 'en-US',
            },
          },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    let responseText = result.fulfillmentText;

    if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
      const textMessages = result.fulfillmentMessages
        .filter((msg) => msg.text && msg.text.text)
        .map((msg) => msg.text.text[0]);

      if (textMessages.length > 0) {
        responseText = textMessages.join('\n');
      }
    }

    return res.status(200).json({
      response: responseText || 'I did not understand that. Can you rephrase?',
      intent: result.intent?.displayName,
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
}