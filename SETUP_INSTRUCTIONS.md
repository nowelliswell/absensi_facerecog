# 🚀 Setup Instructions - Step by Step

## ⚠️ Important: npm install sedang berjalan

Proses `npm install` di frontend sedang berjalan di background. Ini normal dan membutuhkan waktu 5-10 menit karena menginstall 300+ packages.

## 📋 Setup Checklist

### 1. ✅ Backend Setup (Sudah Selesai)

Backend sudah siap di folder `backend/`:
- ✅ `api.py` - Main API file
- ✅ `requirements.txt` - Dependencies
- ✅ `flask_db.sql` - Database schema
- ✅ `dataset/` - Face images folder
- ✅ `resources/` - Haar Cascade

### 2. ⏳ Frontend Setup (Sedang Proses)

**Status:** `npm install` sedang berjalan

**Tunggu hingga selesai** (5-10 menit), Anda akan melihat:
```
added 300+ packages in 5m
```

Jika ada error atau stuck, lakukan:

```bash
# Buka terminal baru di folder frontend
cd frontend

# Hapus node_modules dan package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Install ulang
npm install
```

### 3. ⏳ Database Setup (Belum)

**Langkah:**

1. **Start MySQL Server**
   - Buka XAMPP Control Panel
   - Klik "Start" pada MySQL
   - Tunggu hingga status hijau

2. **Import Database**
   
   **Option A: Via Command Line**
   ```bash
   mysql -u root -p < backend/flask_db.sql
   ```
   
   **Option B: Via phpMyAdmin**
   - Buka http://localhost/phpmyadmin
   - Klik "New" → Create database: `flask_db`
   - Pilih database `flask_db`
   - Klik tab "Import"
   - Pilih file `backend/flask_db.sql`
   - Klik "Go"

3. **Verify Database**
   ```bash
   mysql -u root -p -e "USE flask_db; SHOW TABLES;"
   ```
   
   Harus ada 4 tabel:
   - `absensi`
   - `accs_hist`
   - `img_dataset`
   - `prs_mstr`

## 🎯 Setelah npm install Selesai

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Test Backend API

```bash
cd backend
python api.py
```

Buka browser: http://localhost:5000/api/health

Response yang benar:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-..."
}
```

### 3. Test Frontend

Buka terminal baru:
```bash
cd frontend
npm run dev
```

Buka browser: http://localhost:5173

## 🚀 Running Both Servers

### Option 1: Automatic (Recommended)

Double-click file:
```
start-dev.bat
```

### Option 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
python api.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔧 Troubleshooting

### npm install Error

**Error:** `ENOTEMPTY: directory not empty`

**Solution:**
```bash
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

### MySQL Not Running

**Error:** `Can't connect to MySQL server`

**Solution:**
1. Buka XAMPP Control Panel
2. Start MySQL
3. Atau via command: `net start MySQL80`

### Port Already in Use

**Backend (Port 5000):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Webcam Not Working

Edit `backend/api.py`:
```python
# Line ~180 dan ~450
cap = cv2.VideoCapture(0)  # Ubah 0 ke 1 atau 2
```

## 📊 Progress Tracker

- [x] Project structure organized
- [x] Backend API created
- [x] Frontend copied
- [x] Documentation created
- [ ] npm install completed ⏳ (sedang proses)
- [ ] Backend dependencies installed
- [ ] Database imported
- [ ] Backend tested
- [ ] Frontend tested
- [ ] Both servers running

## ⏱️ Estimated Time

| Task | Time | Status |
|------|------|--------|
| npm install | 5-10 min | ⏳ In Progress |
| Backend setup | 2 min | ⏳ Waiting |
| Database setup | 3 min | ⏳ Waiting |
| Testing | 5 min | ⏳ Waiting |
| **Total** | **15-20 min** | |

## 📝 Next Steps

1. ⏳ **Wait** for npm install to complete
2. ⏳ Install backend dependencies
3. ⏳ Setup MySQL database
4. ⏳ Test backend API
5. ⏳ Test frontend
6. ⏳ Start both servers
7. ✅ Ready to develop!

## 🎉 When Everything is Ready

You'll see:
- Backend: `Running on http://127.0.0.1:5000`
- Frontend: `Local: http://localhost:5173`

Open browser: http://localhost:5173

## 📞 Need Help?

Check these files:
- `README_INTEGRATION.md` - Full setup guide
- `QUICK_START.md` - Quick reference (will be recreated)
- `PROJECT_STRUCTURE.md` - Project structure
- `CLEANUP_SUMMARY.md` - What was cleaned up

## 💡 Tips

1. **Be Patient** - npm install takes time (300+ packages)
2. **Don't Close Terminal** - Let npm install finish
3. **Check MySQL** - Make sure it's running before starting backend
4. **Use 2 Terminals** - One for backend, one for frontend
5. **Check Logs** - Backend logs in terminal, frontend logs in browser console

---

**Current Status:** ⏳ npm install in progress

**Next:** Wait for npm install to complete, then continue with backend setup

**Last Updated:** February 13, 2026
