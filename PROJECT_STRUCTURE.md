# 📁 Project Structure - Clean & Organized

## 🎯 Current Structure (After Cleanup)

```
Sistem-Absensi-Face-Recognition/
│
├── 📂 backend/                      # Flask API Backend
│   ├── 📂 dataset/                  # Face images for training
│   │   └── [employee_id].[img_id].jpg
│   ├── 📂 resources/                # Haar Cascade files
│   │   └── haarcascade_frontalface_default.xml
│   ├── 📂 static/                   # Static files (backup)
│   │   ├── css/
│   │   ├── img/
│   │   ├── js/
│   │   └── uploads/
│   ├── 📂 templates/                # HTML templates (backup)
│   │   └── *.html
│   ├── 📄 api.py                    # ⭐ Main API file (NEW)
│   ├── 📄 app.py                    # Old Flask app (backup)
│   ├── 📄 classifier.xml            # Trained face recognition model
│   ├── 📄 flask_db.sql              # Database schema
│   └── 📄 requirements.txt          # Python dependencies
│
├── 📂 frontend/                     # React Frontend
│   ├── 📂 public/                   # Public assets
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── 📂 src/                      # Source code
│   │   ├── 📂 assets/               # Images, fonts, etc.
│   │   │   └── hero-bg.jpg
│   │   ├── 📂 components/           # React components
│   │   │   ├── 📂 ui/               # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ... (50+ components)
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── NavLink.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── 📂 hooks/                # Custom React hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── 📂 lib/                  # Utilities & services
│   │   │   ├── api.ts               # ⭐ API service layer
│   │   │   ├── mock-data.ts         # Mock data (to be replaced)
│   │   │   ├── store.ts             # Zustand store
│   │   │   └── utils.ts             # Helper functions
│   │   ├── 📂 pages/                # Page components
│   │   │   ├── Index.tsx            # Landing page
│   │   │   ├── Dashboard.tsx        # Admin dashboard
│   │   │   ├── Attendance.tsx       # Clock in/out
│   │   │   ├── FaceRecognition.tsx  # Live recognition
│   │   │   ├── EmployeeRegistration.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── 📂 test/                 # Test files
│   │   │   ├── example.test.ts
│   │   │   └── setup.ts
│   │   ├── App.tsx                  # Main App component
│   │   ├── App.css                  # App styles
│   │   ├── main.tsx                 # Entry point
│   │   ├── index.css                # Global styles
│   │   └── vite-env.d.ts            # Vite types
│   ├── 📄 .env                      # Environment variables
│   ├── 📄 .gitignore                # Git ignore
│   ├── 📄 components.json           # shadcn/ui config
│   ├── 📄 eslint.config.js          # ESLint config
│   ├── 📄 index.html                # HTML template
│   ├── 📄 package.json              # Node dependencies
│   ├── 📄 package-lock.json         # Lock file
│   ├── 📄 postcss.config.js         # PostCSS config
│   ├── 📄 README.md                 # Frontend README
│   ├── 📄 tailwind.config.ts        # Tailwind config
│   ├── 📄 tsconfig.json             # TypeScript config
│   ├── 📄 tsconfig.app.json         # App TS config
│   ├── 📄 tsconfig.node.json        # Node TS config
│   ├── 📄 vite.config.ts            # Vite config
│   └── 📄 vitest.config.ts          # Vitest config
│
├── 📂 .git/                         # Git repository
├── 📂 .vscode/                      # VS Code settings
│   └── settings.json
│
├── 📄 .gitignore                    # Git ignore (root)
├── 📄 README.md                     # Main README
├── 📄 README_INTEGRATION.md         # ⭐ Integration guide
├── 📄 QUICK_START.md                # ⭐ Quick start guide
├── 📄 INTEGRATION_PLAN.md           # Architecture plan
├── 📄 IMPLEMENTATION_SUMMARY.md     # Progress summary
├── 📄 PROJECT_STRUCTURE.md          # This file
└── 📄 start-dev.bat                 # ⭐ Quick start script
```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| Backend Files | 5 | Python files, SQL, requirements |
| Frontend Files | 100+ | React components, pages, utils |
| Documentation | 6 | README, guides, plans |
| Config Files | 15+ | Package.json, tsconfig, etc. |
| Total | 120+ | All project files |

## 🗑️ Files Removed (Cleanup)

### ✅ Deleted from Root:
- ❌ `app.py` → Moved to `backend/app.py`
- ❌ `requirements.txt` → Moved to `backend/requirements.txt`
- ❌ `flask_db.sql` → Moved to `backend/flask_db.sql`
- ❌ `classifier.xml` → Moved to `backend/classifier.xml`
- ❌ `captured_face.png` → Temporary file
- ❌ `pyvenv.cfg` → Virtual env config
- ❌ `dlib-19.24.99-cp312-cp312-win_amd64.whl` → Installer

### ✅ Deleted Folders:
- ❌ `dataset/` → Moved to `backend/dataset/`
- ❌ `resources/` → Moved to `backend/resources/`
- ❌ `static/` → Moved to `backend/static/`
- ❌ `templates/` → Moved to `backend/templates/`
- ❌ `Scripts/` → Virtual environment
- ❌ `__pycache__/` → Python cache
- ❌ `absensi_facerecog/` → Cloned repo (not needed)
- ❌ `faceguard-pro/` → Cloned repo (copied to frontend/)

## 📝 Important Files

### Backend
| File | Purpose |
|------|---------|
| `backend/api.py` | ⭐ Main API with RESTful endpoints |
| `backend/app.py` | Old Flask app (backup) |
| `backend/requirements.txt` | Python dependencies |
| `backend/flask_db.sql` | Database schema |
| `backend/classifier.xml` | Trained face model |

### Frontend
| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main React app |
| `frontend/src/lib/api.ts` | ⭐ API service layer |
| `frontend/src/pages/*.tsx` | Page components |
| `frontend/package.json` | Node dependencies |
| `frontend/.env` | Environment config |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Main project README |
| `README_INTEGRATION.md` | ⭐ Full setup guide |
| `QUICK_START.md` | ⭐ Quick reference |
| `INTEGRATION_PLAN.md` | Architecture details |
| `IMPLEMENTATION_SUMMARY.md` | Progress tracking |
| `PROJECT_STRUCTURE.md` | This file |

### Scripts
| File | Purpose |
|------|---------|
| `start-dev.bat` | ⭐ Start both servers |

## 🎯 Key Directories

### Backend Directories
```
backend/
├── dataset/        # Face images (100 per employee)
├── resources/      # Haar Cascade XML
├── static/         # Old static files (backup)
└── templates/      # Old HTML templates (backup)
```

### Frontend Directories
```
frontend/src/
├── components/     # Reusable UI components
├── pages/          # Page components (routes)
├── lib/            # Utilities & API services
├── hooks/          # Custom React hooks
├── assets/         # Images, fonts
└── test/           # Test files
```

## 🔧 Configuration Files

### Backend
- `requirements.txt` - Python packages
- `flask_db.sql` - Database schema

### Frontend
- `package.json` - Node packages
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite bundler config
- `tailwind.config.ts` - Tailwind CSS config
- `.env` - Environment variables

## 📦 Dependencies

### Backend (Python)
```
Flask==3.0.3
Flask-CORS==4.0.0
mysql-connector-python==8.4.0
opencv-contrib-python==4.10.0.82
opencv-python==4.10.0.82
numpy==1.26.4
pillow==10.3.0
```

### Frontend (Node)
```
react==18.3.1
typescript==5.8.3
vite==5.4.19
tailwindcss==3.4.17
@tanstack/react-query==5.83.0
zustand==5.0.11
framer-motion==12.34.0
react-webcam==7.2.0
recharts==2.15.4
```

## 🚀 Quick Commands

### Start Development
```bash
# Quick start (both servers)
start-dev.bat

# Or manually:
# Terminal 1
cd backend && python api.py

# Terminal 2
cd frontend && npm run dev
```

### Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/
```

## 📊 Project Size

| Category | Size |
|----------|------|
| Backend | ~5 MB |
| Frontend (node_modules) | ~300 MB |
| Frontend (src) | ~2 MB |
| Documentation | ~50 KB |
| Total (with dependencies) | ~310 MB |
| Total (without node_modules) | ~10 MB |

## 🎨 Tech Stack Summary

### Backend
- **Framework**: Flask 3.0.3
- **Database**: MySQL 8.0
- **Face Recognition**: OpenCV + LBPH
- **API**: RESTful JSON API
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State**: Zustand
- **Data Fetching**: React Query
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Camera**: react-webcam

## 📈 Project Status

- ✅ Project structure organized
- ✅ Backend API created
- ✅ Frontend setup complete
- ✅ API service layer created
- ✅ Documentation complete
- ⏳ API integration (next step)
- ⏳ Testing
- ⏳ Production deployment

## 🎯 Next Steps

1. Install dependencies (backend & frontend)
2. Setup MySQL database
3. Start both servers
4. Connect frontend to backend API
5. Test all features
6. Deploy to production

---

**Last Updated:** February 13, 2026
**Status:** 🟢 Clean & Ready for Development
