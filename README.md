<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1eViPfaHgSfI7l2t3vZUYSR0NEcXTA1Io

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file in the project root or copy from `.env.example` and set the Vite env var:

   ```
   cp .env.example .env
   # then edit .env and replace the placeholder value
   ```

   Set your Gemini / Google GenAI API key in the `.env` file as:

   ```text
   VITE_GOOGLE_API_KEY=your_google_genai_api_key_here
   ```

3. Run the app:
   `npm run dev`

Security note:

- The example stores the key in a Vite client env var for convenience during local development. This exposes the key to the browser and is NOT recommended for production.
- Recommended production approach: create a small server-side endpoint that holds the API key and proxies/authorizes requests to the GenAI API. The frontend should call your server endpoint instead of directly contacting GenAI.
- See also: `.env.example` for the environment variable name and usage.
