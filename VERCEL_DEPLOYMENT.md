# Vercel Deployment Guide for NebulaStream Frontend

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your backend deployed and accessible (e.g., on Render)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)
```bash
cd nebulastream
git init
git add .
git commit -m "Initial commit - NebulaStream frontend"
```

### 1.2 Create GitHub Repository
1. Go to GitHub and create a new repository: `Youtube_clone_frontend`
2. Add the remote origin:
```bash
git branch -M main
git remote add origin https://github.com/RehanTariq536924555/Youtube_clone_frontend.git
git push -u origin main
```

## Step 2: Configure Environment Variables

### 2.1 Update API Base URL
Before deploying, you need to update the API base URL in your services to point to your deployed backend.

Create a `.env.production` file:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### 2.2 Update Service Files
Make sure your services use environment variables for the API URL:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your `Youtube_clone_frontend` repository

### 3.2 Configure Project Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (or leave empty)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Environment Variables
In Vercel dashboard, add these environment variables:
- `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
- `NODE_ENV`: `production`

### 3.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 4: Post-Deployment Configuration

### 4.1 Update Backend CORS
Make sure your backend allows requests from your Vercel domain:
```javascript
// In your backend CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app'
];
```

### 4.2 Test Deployment
1. Visit your Vercel URL
2. Test key features:
   - User authentication
   - Video upload
   - Video playback
   - Responsive design on mobile

## Step 5: Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are fixed

### API Connection Issues
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS configuration
- Ensure backend is accessible from Vercel

### Routing Issues
- The `vercel.json` file handles SPA routing
- All routes should redirect to `index.html`

## Automatic Deployments
Once connected, Vercel will automatically deploy:
- Every push to `main` branch → Production deployment
- Every push to other branches → Preview deployment

## Commands Summary
```bash
# Initial setup
cd nebulastream
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/RehanTariq536924555/Youtube_clone_frontend.git
git push -u origin main

# Future updates
git add .
git commit -m "Update description"
git push
```

## Important Notes
1. **Environment Variables**: Make sure to set `VITE_API_BASE_URL` in Vercel
2. **Backend URL**: Update all hardcoded `localhost:4000` references
3. **CORS**: Configure backend to allow your Vercel domain
4. **Build Time**: First deployment may take 2-3 minutes
5. **Free Tier**: Vercel free tier has bandwidth limits but should be sufficient for testing

Your app will be available at: `https://your-project-name.vercel.app`