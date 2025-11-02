# Instructions to Push to GitHub

## Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `oldskillfinder`
3. Choose Public or Private
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Run these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/oldskillfinder.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/oldskillfinder.git
git push -u origin main
```

That's it! Your code will be uploaded to GitHub.

