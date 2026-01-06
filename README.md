# Fountain Projects

A simple project tracking website displaying project status and links.

## Features

- Clean, modern UI
- Responsive design
- Project status tracking (blocked, in progress, complete)
- Direct links to projects

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then visit `http://localhost:8000`

## Deployment

### GitHub

1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

   Or connect your GitHub repository directly through the Vercel dashboard at https://vercel.com

## Adding Projects

Edit the `projects` array in `script.js` to add or modify projects.

