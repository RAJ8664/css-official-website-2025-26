\# Dialogflow Credentials Setup Guide



\## Required Files (NOT in Git)



\### 1. Service Account JSON Key

\- \*\*Filename:\*\* `whatever-ceyu-b622005692d5.json`

\- \*\*Location:\*\* Project root directory

\- \*\*How to obtain:\*\* Contact the project maintainer



\### 2. Environment Variables File

Create a `.env` file in project root:

GOOGLE\_PROJECT\_ID=whatever-ceyu

GOOGLE\_APPLICATION\_CREDENTIALS=./whatever-ceyu-b622005692d5.json

PORT=5000

Setup Instructions

Step 1: Get the Credentials File

Contact the project maintainer to obtain whatever-ceyu-b622005692d5.json and save it in your project root directory.

Step 2: Create Environment Variables

Create a .env file in the project root with the content shown above.

Step 3: Verify File Structure

Your project root should look like this:

css-official-website-2025-26/

├── node\_modules/

├── src/

├── package.json

├── .env                                    ✅ (you created this)

├── whatever-ceyu-b622005692d5.json        ✅ (you added this)

├── server.js

└── CREDENTIALS\_SETUP.md

Step 4: Install Dependencies

bashnpm install

Step 5: Run the Application

bashnpm start

This will start:



Vite dev server on http://localhost:5173

Dialogflow backend on http://localhost:5000



Step 6: Test the Chatbot



Open http://localhost:5173 in your browser

Click the chat launcher button (bottom-right corner)

Click "Start a convo"

Type a message and verify the bot responds





Security Best Practices

DO:



Keep credentials in .env and \*.json files locally

Share credentials only through secure channels

Add .env and \*.json to .gitignore

Rotate credentials if accidentally exposed



DON'T:



Never commit .env or \*.json files to Git

Never share credentials in public channels

Never include credentials in screenshots

Never push credentials to GitHub





Troubleshooting

Error: "Credentials file not found"

Solution: Make sure whatever-ceyu-b622005692d5.json is in the project root directory (not in src/ or any subfolder).

Error: "Failed to initialize Dialogflow client"

Solution:



Re-download the JSON key from Google Cloud Console

Verify the JSON file is valid

Check file permissions



Error: "Cannot find module 'dotenv'"

Solution:

bashnpm install

Chatbot says "Sorry, I am having trouble connecting"

Solutions:



Make sure backend server is running on port 5000

Check browser console (F12) for errors

Verify both .env and JSON files exist





For Production Deployment

For production (Vercel, Netlify, etc.), set these environment variables:



GOOGLE\_PROJECT\_ID: whatever-ceyu

GOOGLE\_CREDENTIALS\_JSON: The entire JSON file content as a string

PORT: 5000 (optional)





Need Help?



Credentials access: Contact project maintainer

Technical issues: Open an issue on GitHub

Setup questions: Check this guide first





How to Get Credentials

From Google Cloud Console:



Go to https://console.cloud.google.com

Select project: whatever-ceyu

Navigate to: IAM \& Admin → Service Accounts

Find the service account

Go to Keys tab → Add Key → Create new key → JSON

Download and save as whatever-ceyu-b622005692d5.json



From Team Lead:

Request the file through secure channels (email, Google Drive, etc.)



Remember: These credentials provide access to our Dialogflow agent. Handle them with care! 

