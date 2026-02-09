# Railway.app Deployment Guide

## Prerequisites
- GitHub account with repo pushed: `https://github.com/satyamgatthewar06/hospital_backend`
- Railway account (sign up at https://railway.app)
- Custom domain: `healthapp.io`

---

## Step 1: Push Code to GitHub

```bash
# Initialize git in project root
cd "C:\Users\satya\OneDrive\Desktop\portfolio page\frontend task"
git init
git add .
git commit -m "Initial commit: Hospital Management System"
git branch -M main
git remote add origin https://github.com/satyamgatthewar06/hospital_backend.git
git push -u origin main
```

---

## Step 2: Deploy on Railway

1. **Log in to Railway:** https://railway.app
2. **Create new project:**
   - Click "New Project" → "Deploy from GitHub"
   - Connect your GitHub account
   - Select repo: `hospital_backend`
3. **Railway auto-detects `docker-compose.yml`** and creates services:
   - `db` (MySQL)
   - `backend` (Node.js API)
   - `frontend` (React + Nginx)

### Connect Railway MySQL to your backend

Railway exposes the MySQL connection string as a templated variable. To connect your backend to Railway's MySQL service:

1. In Railway, open the `db` (MySQL) service and click **Connect**
2. Under the **Private Network** tab Railway shows the value: `${{ MySQL.MYSQL_URL }}`
3. Copy that value into a new variable for your `backend` service. Example:

```
MYSQL_URL=${{ MySQL.MYSQL_URL }}
```

4. In the `backend` service **Variables** tab, add the variable `MYSQL_URL` and paste the Railway value exactly as above. The backend code has been updated to prefer `MYSQL_URL` when present.

5. (Optional) You can still set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` manually — the app will use `MYSQL_URL` if set.

This approach avoids managing individual host/port/user values and lets Railway handle credentials securely.

---

## Step 3: Set Environment Variables

In Railway dashboard:

1. Click `backend` service
2. Go to **Variables** tab
3. Add these (copy from your `.env`):
   ```
   MONGO_URI=mongodb+srv://satyamgatthewar06_db_user:Satyam7289@cluster0.voevdkw.mongodb.net/hospitalDB?retryWrites=true&w=majority
   
   DB_HOST=<Railway MySQL hostname>  # Railway fills this auto
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=<set a strong password>
   DB_NAME=hospital_management
   
   JWT_SECRET=<generate random: openssl rand -base64 32>
   JWT_REFRESH_SECRET=<generate random: openssl rand -base64 32>
   
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://healthapp.io
   ```

4. Similarly, for **frontend** service, add:
   ```
   REACT_APP_API_URL=https://backend-railway-domain.up.railway.app/api
   ```

---

## Step 4: Get Service URLs

After deployment, Railway assigns URLs:
- **Backend:** `https://hospital-backend-prod-abc123.up.railway.app`
- **Frontend:** `https://hospital-frontend-prod-xyz789.up.railway.app`

Test them:
- Backend health: `https://hospital-backend-prod-abc123.up.railway.app/api/health`
- Frontend: `https://hospital-frontend-prod-xyz789.up.railway.app`

---

## Step 5: Configure Custom Domain

### Option A: Railway Custom Domain (easiest)

1. Go to **frontend** service in Railway
2. Settings → **Custom Domain**
3. Add: `healthapp.io`
4. Railway generates a CNAME record
5. Update your domain registrar DNS:
   - Type: `CNAME`
   - Name: `healthapp.io`
   - Value: `<Railway CNAME>`
6. Wait 5-15 minutes for DNS propagation
7. Visit: `https://yourdomain.com` ✅

### Option B: Custom Domain via Registrar

1. Get Railway domain info
2. Log into your registrar (GoDaddy, Namecheap, etc.)
3. Update DNS:
   - Add CNAME pointing to Railway URL
   - Or use A record pointing to Railway IP

---

## Step 6: Enable Auto-Deploy

By default, Railway auto-deploys when you push to GitHub `main` branch.

To test:
```bash
# Make a small change to server.js or frontend code
echo "// Updated" >> hospital-backend/server.js
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Watch Railway dashboard — deployment starts automatically!

---

## Step 7: Monitoring & Logs

1. Go to Railway dashboard
2. Select a service (backend/frontend/db)
3. **Logs** tab — real-time output
4. **Metrics** tab — CPU, memory, requests

---

## Step 8: SSL/HTTPS

Railway auto-provisions **Let's Encrypt SSL** for custom domains. No extra config needed!

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `503 Service Unavailable` | Check backend logs, verify DB connection |
| Custom domain not resolving | Wait 15+ min for DNS, check CNAME in registrar |
| Frontend can't reach API | Update `REACT_APP_API_URL` env var |
| Database connection error | Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` in Railway |

---

## Next: GitHub Actions (Optional - Auto Builds)

See `.github/workflows/deploy.yml` for automated testing + deployment.

---

**Your live URLs will be:**
- Frontend: `https://healthapp.io`
- Backend API: `https://healthapp.io/api/health`

Enjoy! 🚀
