# Deployment Guide

## Setting Environment Variables for Production

When deploying this application, you need to set the `VITE_DEEPSEEK_API_KEY` environment variable in your hosting platform. The app will now load even without the key, but will show an error when users try to use AI features.

### ⚠️ Important Security Note

**VITE_ prefixed variables are exposed to the client-side code!** This means your API key will be visible in the browser's JavaScript bundle. While this works, it's not ideal for production. Consider:

1. **Rate limiting** your API key in DeepSeek's dashboard
2. **Monitoring usage** to detect abuse
3. **Future migration** to a backend proxy (recommended for production)

### Platform-Specific Instructions

#### Vercel

1. Go to your project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key (e.g., `sk-...`)
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application (the variable is only applied on new deployments)

#### Netlify

1. Go to your site dashboard
2. Click **Site configuration** → **Environment variables**
3. Click **Add variable**
4. Add:
   - **Key**: `VITE_DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key
5. Click **Save**
6. **Trigger a new deployment** (Deploys → Trigger deploy)

#### Cloudflare Pages

1. Go to your Pages project
2. Click **Settings** → **Environment variables**
3. Click **Add variable**
4. Add:
   - **Variable name**: `VITE_DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key
   - **Environment**: Select all (Production, Preview)
5. Click **Save**
6. **Redeploy** from the Deployments tab

#### GitHub Pages / Static Hosting

For static hosting without build support:

1. **Build locally** with the environment variable set:
   ```bash
   export VITE_DEEPSEEK_API_KEY=sk-your-key-here
   npm run build
   ```
2. Upload the `dist/` folder contents

Or use GitHub Actions:
- Add `VITE_DEEPSEEK_API_KEY` as a GitHub Secret
- Configure your workflow to use it during build

#### Other Platforms

For other platforms (AWS Amplify, Railway, Render, etc.):

1. Find **Environment Variables** or **Config Vars** in settings
2. Add `VITE_DEEPSEEK_API_KEY` with your API key value
3. Rebuild/redeploy the application

### Verifying Environment Variables Are Set

After deployment, you can verify the variable is available by:

1. Opening browser DevTools (F12)
2. Going to Console
3. Typing: `import.meta.env.VITE_DEEPSEEK_API_KEY`
4. You should see your key (this confirms it's exposed to client - be aware of security implications!)

### Testing Locally Before Deployment

Create a `.env` file in your project root:

```env
VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
```

Then run:
```bash
npm run dev
```

The app should work without errors.

### Troubleshooting

**Error: "DeepSeek API key is not configured"**
- Verify the variable name is exactly `VITE_DEEPSEEK_API_KEY` (case-sensitive)
- Make sure you redeployed after adding the variable
- Check that the variable is set for the correct environment (Production/Preview)

**White screen on deployment**
- This should now be fixed - the app loads even without the key
- Errors only appear when trying to use AI features

**API key visible in browser**
- This is expected behavior with VITE_ variables
- They're bundled into the client-side code
- For production, consider creating a backend proxy API

