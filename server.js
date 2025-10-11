import express from 'express';
import cors from 'cors';
import dialogflowLib from '@google-cloud/dialogflow';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const credentials = process.env.GOOGLE_CREDENTIALS_JSON 
  ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
  : undefined;

const sessionClient = new dialogflowLib.SessionsClient(
  credentials 
    ? { credentials } 
    : { keyFilename: join(__dirname, 'whatever-ceyu-b622005692d5.json') }
);

const projectId = process.env.GOOGLE_PROJECT_ID || 'whatever-ceyu';

app.post('/api/dialogflow', async (req, res) => {
  try {
    const { message, sessionId, isEvent } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    let request;

    if (isEvent) {
      request = {
        session: sessionPath,
        queryInput: {
          event: {
            name: message,
            languageCode: 'en-US',
          },
        },
      };
    } else {
      request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'en-US',
          },
        },
      };
    }

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

    res.json({
      response: responseText || 'I did not understand that. Can you rephrase?',
      intent: result.intent?.displayName,
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Dialogflow server running on http://localhost:${port}`);
});