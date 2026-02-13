# 🚀 Face Recognition Attendance System - React + Flask

Sistem absensi modern dengan face recognition menggunakan React (frontend) dan Flask (backend).

## 📁 Struktur Project

```
project-root/
├── backend/                 # Flask API
│   ├── api.py              # Main API file (NEW)
│   ├── app.py              # Old Flask app (backup)
│   ├── requirements.txt
│   ├── flask_db.sql
│   ├── dataset/
│   ├── resources/
│   ├── static/
│   └── templates/
│
├── frontend/                # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   │   └── api.ts      # API service layer
│   │   └── ...
│   ├── package.json
│   ├── .env
│   └── vite.config.ts
│
└── README_INTEGRATION.md
```

## 🔧 Setup Backend (Flask API)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Dependencies baru yang ditambahkan:
- `Flask-CORS==4.0.0` - Untuk CORS support

### 2. Setup Database

Pastikan MySQL server running, lalu import database:

```bash
mysql -u root -p < flask_db.sql
```

Atau via phpMyAdmin:
1. Buka http://localhost/phpmyadmin
2. Create database `flask_db`
3. Import file `flask_db.sql`

### 3. Jalankan Backend API

```bash
python api.py
```

Server akan running di: `http://localhost:5000`

### 4. Test API

Buka browser atau Postman:
```
GET http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-..."
}
```

## 🎨 Setup Frontend (React)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Konfigurasi Environment

File `.env` sudah dibuat dengan konfigurasi:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Server akan running di: `http://localhost:5173`

## 🚀 Running Both Servers

Buka 2 terminal:

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

Akses aplikasi di browser: `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/next-id` - Get next employee ID
- `POST /api/employees/register` - Register new employee

### Face Recognition
- `GET /api/face/dataset/:id` - Video stream for dataset generation
- `POST /api/face/train/:id` - Train classifier
- `POST /api/face/recognize` - Recognize face from image

### Attendance
- `POST /api/attendance/clock-in` - Clock in
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/history` - Attendance history
- `DELETE /api/attendance/:id` - Delete attendance

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/weekly` - Weekly attendance
- `GET /api/dashboard/monthly` - Monthly trend

### Video Streaming
- `GET /api/video/recognition` - Live face recognition stream

## 🔄 Workflow Penggunaan

### 1. Registrasi Karyawan Baru

**Frontend:**
1. Buka `http://localhost:5173/register`
2. Isi form (nama, posisi)
3. Generate dataset (100 foto)
4. Train classifier

**Backend API Flow:**
```
POST /api/employees/register
  → GET /api/face/dataset/:id (video stream)
  → POST /api/face/train/:id
```

### 2. Clock In dengan Face Recognition

**Frontend:**
1. Buka `http://localhost:5173/attendance`
2. Webcam aktif
3. Capture foto
4. Face recognition
5. Clock in otomatis

**Backend API Flow:**
```
POST /api/face/recognize (image base64)
  → POST /api/attendance/clock-in
```

### 3. Live Face Recognition

**Frontend:**
1. Buka `http://localhost:5173/recognition`
2. Video stream aktif
3. Real-time detection

**Backend API Flow:**
```
GET /api/video/recognition (MJPEG stream)
```

### 4. Dashboard Admin

**Frontend:**
1. Login: `http://localhost:5173/login`
2. Dashboard: `http://localhost:5173/dashboard`
3. View stats, charts, attendance table

**Backend API Flow:**
```
POST /api/auth/login
  → GET /api/dashboard/stats
  → GET /api/dashboard/weekly
  → GET /api/dashboard/monthly
  → GET /api/attendance/today
```

## 🎨 Frontend Features

### Pages
1. **Landing Page** (`/`) - Hero section dengan stats
2. **Attendance** (`/attendance`) - Clock in/out dengan webcam
3. **Face Recognition** (`/recognition`) - Live monitoring
4. **Employee Registration** (`/register`) - Registrasi karyawan
5. **Dashboard** (`/dashboard`) - Analytics & charts
6. **Admin Login** (`/login`) - Authentication
7. **Settings** (`/settings`) - System configuration

### Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Router v6
- Zustand (state management)
- React Query (data fetching)
- react-webcam (camera)
- Recharts (charts)

## 🔒 Security

### Backend
- CORS enabled untuk `http://localhost:5173`
- Session-based authentication
- SQL injection prevention (parameterized queries)
- Input validation

### Frontend
- Axios interceptors untuk error handling
- Automatic redirect ke login jika unauthorized
- Credentials included untuk session cookies

## 🐛 Troubleshooting

### Backend Issues

**1. MySQL Connection Error**
```
Error: Can't connect to MySQL server
```
Solution: Start MySQL server (XAMPP/WAMP)

**2. CORS Error**
```
Access-Control-Allow-Origin error
```
Solution: Pastikan Flask-CORS terinstall dan configured

**3. Webcam Not Found**
```
Error: VideoCapture failed
```
Solution: 
- Pastikan webcam terhubung
- Ubah `cv2.VideoCapture(0)` ke `(1)` atau `(2)`

### Frontend Issues

**1. API Connection Failed**
```
Network Error
```
Solution: Pastikan backend running di port 5000

**2. Webcam Permission Denied**
```
getUserMedia error
```
Solution: Allow camera permission di browser

**3. Build Error**
```
Module not found
```
Solution: `npm install` ulang

## 📦 Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Serve dari Flask (Optional)

Tambahkan di `backend/api.py`:

```python
from flask import send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path and os.path.exists(f"../frontend/dist/{path}"):
        return send_from_directory('../frontend/dist', path)
    return send_from_directory('../frontend/dist', 'index.html')
```

Jalankan:
```bash
cd backend
python api.py
```

Akses: `http://localhost:5000`

## 🚀 Deployment

### Backend (Flask)
- Deploy ke: Heroku, Railway, DigitalOcean, AWS
- Gunakan Gunicorn untuk production:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:5000 api:app
  ```

### Frontend (React)
- Deploy ke: Vercel, Netlify, Cloudflare Pages
- Update `.env` dengan production API URL

## 📝 Notes

- Backend API menggunakan session-based auth (bukan JWT)
- Video streaming menggunakan MJPEG format
- Face recognition menggunakan LBPH algorithm
- Database: MySQL (bisa diganti PostgreSQL)

## 🎯 Next Steps

1. ✅ Setup project structure
2. ✅ Create API endpoints
3. ✅ Create API service layer
4. ⏳ Update frontend pages untuk connect ke API
5. ⏳ Test semua fitur
6. ⏳ Production deployment

## 📞 Support

Jika ada masalah, cek:
1. Backend logs di terminal
2. Frontend console di browser DevTools
3. Network tab untuk API requests

---

**Happy Coding! 🚀**
