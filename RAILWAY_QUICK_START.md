# 🚀 Railway Deployment - Quick Checklist (5 Minutes)

## ✅ What I Just Did
- [x] Initialized Git repo and pushed to GitHub
  - Repo: `https://github.com/satyamgatthewar06/hospital_backend`
  - Branch: `main`
- [x] Created deployment configs:
  - `docker-compose.yml` (services: db, backend, frontend)
  - `.dockerignore` files
  - `.github/workflows/deploy.yml` (auto-test & deploy)
- [x] Updated domain to: `healthapp.io`

---

## 🎯 Your Next Steps (Do These Now)

### Step 1: Go to Railway (2 min)
1. Visit https://railway.app
2. Click **"Sign up"** or **"Sign in"** (use GitHub)
3. Click **"New Project"**
4. Select **"Deploy from GitHub"**
5. Authorize Railway to access GitHub
6. Select your repo: `hospital_backend`

**Railway will automatically:**
- Detect `docker-compose.yml`
- Create 3 services: `db`, `backend`, `frontend`
- Start building Docker images

---

### Step 2: Configure Environment Variables (2 min)

#### For `backend` service:
Go to backend → **Variables** tab → add these:

```
MONGO_URI=mongodb+srv://satyamgatthewar06_db_user:Satyam7289@cluster0.voevdkw.mongodb.net/hospitalDB?retryWrites=true&w=majority

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SET_A_STRONG_PASSWORD_HERE
DB_NAME=hospital_management

JWT_SECRET=generate-random-32-chars-here-use-openssl-rand--base64-32
JWT_REFRESH_SECRET=generate-random-32-chars-here-use-openssl-rand--base64-32

NODE_ENV=production
PORT=5000
FRONTEND_URL=https://healthapp.io
```

**⚠️ IMPORTANT:** Generate strong JWT secrets:
- Windows PowerShell:
  ```powershell
  [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
  ```
- Or use: https://1password.com/password-generator/

#### For `frontend` service:
Go to frontend → **Variables** tab → add:

```
REACT_APP_API_URL=https://backend-XXXXX.up.railway.app/api
```
(Replace `XXXXX` with Railway's assigned backend URL - you'll see this after deploy)

---

### Step 3: Wait for Deployment (1 min)

- Watch **Deployments** tab
- Status goes: `Building` → `Deploying` → `Live` ✅
- Once `Live`, click on each service to get URLs

---

### Step 4: Get Service URLs (1 min)

Railway assigns URLs like:
- `https://hospital-backend-prod-abc.up.railway.app`
- `https://hospital-frontend-prod-xyz.up.railway.app`

**Test them:**
```
Backend health: https://hospital-backend-prod-abc.up.railway.app/api/health
Frontend: https://hospital-frontend-prod-xyz.up.railway.app
```

---

### Step 5: Connect Custom Domain `healthapp.io` (Auto SSL) (2-5 min)

1. **Click `frontend` service** in Railway
2. Go to **Settings** → **Custom Domain**
3. Enter: `healthapp.io`
4. Railway generates a **CNAME record**
5. **Copy the CNAME value**
6. Go to your domain registrar (GoDaddy, Namecheap, etc.)
7. Update DNS records:
   - Type: `CNAME`
   - Host/Name: `healthapp.io`
   - Value: Paste Railway's CNAME
8. **Wait 5-15 minutes** for DNS to propagate
9. Visit `https://healthapp.io` 🎉

---

## 🎉 Done!

Your hospital app will be **live at:**
```
https://healthapp.io
```

With:
- ✅ Backend API: `https://healthapp.io/api/*`
- ✅ Frontend React UI: `https://healthapp.io`
- ✅ Automatic SSL/HTTPS
- ✅ Auto-deploy on GitHub push
- ✅ MySQL database running

---

## 🔄 Auto-Deploy in Future

Every time you push to GitHub `main` branch:
1. GitHub Actions tests the build
2. Railway automatically deploys new version
3. No manual steps needed!

```bash
# Example: Make a change and auto-deploy
git add .
git commit -m "Update features"
git push origin main
# Railway deploys in 1-2 minutes
```

---

## 📊 Monitoring

In Railway dashboard:
- **Logs** tab: Real-time server output
- **Metrics** tab: CPU, memory, requests/sec
- **Deployments** tab: History of all deployments

---

## ⚠️ Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| `503 Service Unavailable` | Check backend logs, verify `DB_HOST=db` and `MONGO_URI` |
| Domain not resolving | Wait 15+ min, check DNS CNAME in registrar |
| Frontend can't reach backend | Update `REACT_APP_API_URL` with Railway's backend URL |
| Database connection failed | Verify `DB_PASSWORD` and `DB_HOST=db` (not localhost) |

---

## 💾 Backup Notes

Your data is stored in:
1. **MongoDB Atlas** (MONGO_URI) — Already in cloud ✅
2. **MySQL on Railway** — Auto-backed up daily (premium feature)

---

**Questions? Check [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed steps.**

**Ready? Go to https://railway.app now! 🚀**
