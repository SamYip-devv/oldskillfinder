# Environment Variables Setup

## Required Environment Variables

This application requires a DeepSeek API key to function.

### Setup Instructions

1. **Create a `.env` file** in the root directory of the project (same level as `package.json`)

2. **Add your DeepSeek API key** to the `.env` file:
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
   ```

3. **Get your API key** from [DeepSeek Platform](https://platform.deepseek.com/)

4. **Important Security Notes**:
   - The `.env` file is already in `.gitignore` and will NOT be committed to git
   - Never commit API keys to version control
   - If you accidentally committed a key, revoke it immediately and generate a new one
   - For public repositories, always use environment variables, never hardcode keys

### Example `.env` file:
```
VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

### After creating `.env`:

1. Restart your development server if it's running
2. The application will now use your API key from the environment variable

### Troubleshooting

If you see an error: `VITE_DEEPSEEK_API_KEY is not set`:
- Make sure the `.env` file exists in the project root
- Make sure the variable name is exactly `VITE_DEEPSEEK_API_KEY`
- Restart your development server after creating/modifying `.env`
- Make sure there are no spaces around the `=` sign

