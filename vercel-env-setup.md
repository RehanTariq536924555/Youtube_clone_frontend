# Vercel Environment Variables Setup

## Quick Setup for Your Deployed App

Your frontend is deployed at: **https://youtube-clone-frontend-livid.vercel.app**
Your backend is deployed at: **https://youtube-clone-1-ntn4.onrender.com**

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project: `youtube-clone-frontend-livid`
3. Click on the project
4. Go to "Settings" → "Environment Variables"

### Step 2: Add These Environment Variables

Copy and paste these exact values:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://youtube-clone-1-ntn4.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | `321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com` |
| `VITE_GOOGLE_REDIRECT_URL` | `https://youtube-clone-1-ntn4.onrender.com/auth/google/callback` |
| `VITE_FRONTEND_URL` | `https://youtube-clone-frontend-livid.vercel.app` |
| `NODE_ENV` | `production` |

### Step 3: Redeploy
1. After adding environment variables, go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Step 4: Test Your App
Visit: https://youtube-clone-frontend-livid.vercel.app

Test these features:
- ✅ Home page loads
- ✅ Authentication works
- ✅ Video upload works
- ✅ Video playback works
- ✅ API calls to backend work

## Backend CORS Configuration

Make sure your backend (Render) allows requests from your frontend domain.

In your backend code, update CORS settings:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://youtube-clone-frontend-livid.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

## Troubleshooting

### If API calls fail:
1. Check browser console for CORS errors
2. Verify environment variables in Vercel
3. Check if backend is running on Render
4. Test backend API directly: https://youtube-clone-1-ntn4.onrender.com

### If authentication fails:
1. Check Google OAuth configuration
2. Verify redirect URLs match
3. Check browser console for errors

### If videos don't load:
1. Check if backend video endpoints work
2. Verify file upload/storage configuration
3. Check network tab for failed requests

## Success Checklist

- [ ] Environment variables added to Vercel
- [ ] App redeployed after adding env vars
- [ ] Backend CORS updated with frontend URL
- [ ] Google OAuth redirect URLs updated
- [ ] App tested and working

Your YouTube clone should now be fully functional with:
- Frontend: https://youtube-clone-frontend-livid.vercel.app
- Backend: https://youtube-clone-1-ntn4.onrender.com
- Database: Supabase