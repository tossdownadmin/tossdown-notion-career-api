# Deployment Guide - Tab-Based APIs

## ✅ Files Updated

### New API Files Created:
- `api/applications/first-interview.js`
- `api/applications/final-interview.js`
- `api/applications/rejected.js`
- `api/applications/selected.js`
- `api/applications/hired.js`

### Updated Files:
- `vercel.json` - Added 5 new route mappings
- `controllers/applicationController.js` - Added 5 new controller functions
- `routes/applications.js` - Added 5 new routes

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Make sure you're in the project directory
cd o:\notionapis\tossdown-notion-career-api

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Git Push

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Add tab-based API endpoints for application statuses"

# Push to main branch
git push origin main
```

Vercel will automatically deploy when you push to your connected repository.

### Option 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment
5. Or upload the project files manually

---

## 🧪 Testing After Deployment

### Test Each Endpoint:

Replace `YOUR_DOMAIN` with your actual Vercel domain.

**1. First Interview:**
```bash
curl https://YOUR_DOMAIN.vercel.app/api/applications/first-interview
```

**2. Final Interview:**
```bash
curl https://YOUR_DOMAIN.vercel.app/api/applications/final-interview
```

**3. Rejected:**
```bash
curl https://YOUR_DOMAIN.vercel.app/api/applications/rejected
```

**4. Selected:**
```bash
curl https://YOUR_DOMAIN.vercel.app/api/applications/selected
```

**5. Hired:**
```bash
curl https://YOUR_DOMAIN.vercel.app/api/applications/hired
```

### Expected Response:

```json
{
  "success": true,
  "data": [
    // Array of application objects
  ],
  "count": 86,
  "status": "First Interview"
}
```

---

## 🔍 Troubleshooting

### Issue: 404 Not Found

**Cause:** Routes not properly configured in `vercel.json`

**Solution:** 
- Verify `vercel.json` has all 5 new routes
- Redeploy the application
- Clear Vercel cache: `vercel --prod --force`

### Issue: 500 Internal Server Error

**Cause:** Environment variables not set

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these variables exist:
   - `NOTION_TOKEN`
   - `APPLICATION_DATABASE_ID`
3. Redeploy after adding variables

### Issue: Empty Data Array

**Cause:** No records match the status filter

**Solution:**
- Check your Notion database has records with "Applicant Status" field
- Verify the status values match exactly: "First Interview", "Final Interview", etc.
- Check Notion API permissions

---

## 📊 Vercel Routes Configuration

The `vercel.json` now includes these routes:

```json
{
  "src": "/api/applications/first-interview",
  "dest": "/api/applications/first-interview.js"
},
{
  "src": "/api/applications/final-interview",
  "dest": "/api/applications/final-interview.js"
},
{
  "src": "/api/applications/rejected",
  "dest": "/api/applications/rejected.js"
},
{
  "src": "/api/applications/selected",
  "dest": "/api/applications/selected.js"
},
{
  "src": "/api/applications/hired",
  "dest": "/api/applications/hired.js"
}
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] All 5 new endpoints return 200 status
- [ ] Each endpoint returns correct status in response
- [ ] Data array contains application objects
- [ ] Count matches number of records
- [ ] CORS headers are set correctly
- [ ] No console errors in Vercel logs

---

## 🎯 Next Steps

1. **Deploy** using one of the methods above
2. **Test** all 5 endpoints using curl or Postman
3. **Update** your frontend to use the new endpoints
4. **Monitor** Vercel logs for any errors

---

## 📝 Quick Test Commands

```bash
# Set your domain
DOMAIN="your-domain.vercel.app"

# Test all endpoints
echo "Testing First Interview..."
curl https://$DOMAIN/api/applications/first-interview

echo "Testing Final Interview..."
curl https://$DOMAIN/api/applications/final-interview

echo "Testing Rejected..."
curl https://$DOMAIN/api/applications/rejected

echo "Testing Selected..."
curl https://$DOMAIN/api/applications/selected

echo "Testing Hired..."
curl https://$DOMAIN/api/applications/hired
```

