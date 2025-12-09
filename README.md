# 🎯 Sistem Absensi Face Recognition

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.3-green.svg)
![OpenCV](https://img.shields.io/badge/OpenCV-4.10.0-red.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)

**Sistem absensi otomatis berbasis pengenalan wajah (Face Recognition) menggunakan Flask, OpenCV, dan MySQL**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Installation](#-installation)
- [Konfigurasi](#-konfigurasi)
- [Usage](#-usage)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🚀 Tentang Project

**Sistem Absensi Face Recognition** adalah aplikasi web yang memungkinkan pencatatan kehadiran karyawan secara otomatis menggunakan teknologi pengenalan wajah. Sistem ini dibangun dengan Flask sebagai backend, OpenCV untuk pemrosesan gambar, dan MySQL sebagai database.

### Keunggulan:
- ✅ **Otomatis**: Absensi tercatat otomatis saat wajah terdeteksi
- ✅ **Akurat**: Menggunakan LBPH Face Recognizer dengan confidence threshold 70%
- ✅ **Real-time**: Deteksi wajah secara real-time melalui webcam
- ✅ **Tracking Lokasi**: Mencatat koordinat GPS (latitude/longitude)
- ✅ **Admin Panel**: Dashboard untuk monitoring data absensi
- ✅ **Responsive**: UI yang mobile-friendly dengan Bootstrap

---

## ✨ Features

### 🔐 Autentikasi & Keamanan
- Login admin dengan session management
- Password protection untuk halaman admin

### 👤 Manajemen Karyawan
- Registrasi karyawan baru
- Generate dataset wajah (100 foto per karyawan)
- Training model face recognition
- Penyimpanan data karyawan (ID, nama, posisi)

### 📸 Face Recognition
- Deteksi wajah real-time menggunakan Haar Cascade
- Pengenalan wajah dengan LBPH (Local Binary Patterns Histograms)
- Progress bar saat scanning wajah
- Confidence level display

### 📊 Absensi
- Pencatatan absensi otomatis
- Timestamp (tanggal & waktu)
- Geolocation tracking (GPS coordinates)
- Capture foto saat absensi
- Riwayat absensi harian

### 🎛️ Admin Panel
- Dashboard monitoring absensi
- View data absensi lengkap
- Delete data absensi
- Export data (future feature)

---

## 🎬 Demo

### Halaman Utama
![Home Page](docs/screenshots/home.png)

### Registrasi Karyawan
![Registration](docs/screenshots/registration.png)

### Face Recognition
![Face Recognition](docs/screenshots/face-recognition.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin.png)

> **Note**: Tambahkan screenshot di folder `docs/screenshots/` untuk dokumentasi visual

---

## 🛠️ Tech Stack

### Backend
- **Flask 3.0.3** - Python web framework
- **OpenCV 4.10.0** - Computer vision library
- **MySQL Connector 8.4.0** - Database connector
- **NumPy 1.26.4** - Numerical computing
- **Pillow 10.3.0** - Image processing

### Frontend
- **HTML5 & CSS3**
- **Bootstrap 4.5.2** - UI framework
- **jQuery 3.5.1** - JavaScript library
- **JavaScript ES6**

### Database
- **MySQL 8.0** - Relational database

### Computer Vision
- **Haar Cascade Classifier** - Face detection
- **LBPH Face Recognizer** - Face recognition algorithm

---

## 📦 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/)
- **Webcam** - Untuk capture wajah
- **Git** - [Download Git](https://git-scm.com/downloads)

### Sistem Operasi yang Didukung:
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+)

---

## 📥 Installation

### 1. Clone Repository

```bash
git clone https://github.com/username/Sistem-Absensi-Face-Recognition.git
cd Sistem-Absensi-Face-Recognition
```

### 2. Buat Virtual Environment (Opsional tapi Direkomendasikan)

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Jika ada error pada OpenCV atau dlib:**
```bash
# Untuk Windows dengan Python 3.12
pip install dlib-19.24.99-cp312-cp312-win_amd64.whl
```

### 4. Setup Database

#### Opsi A: Menggunakan MySQL Command Line

**Windows (PowerShell):**
```powershell
Get-Content flask_db.sql | mysql -u root -p
```

**Windows (CMD):**
```cmd
mysql -u root -p < flask_db.sql
```

**macOS/Linux:**
```bash
mysql -u root -p < flask_db.sql
```

#### Opsi B: Menggunakan phpMyAdmin

1. Buka `http://localhost/phpmyadmin`
2. Klik **"New"** → Buat database: `flask_db`
3. Pilih database `flask_db`
4. Klik tab **"Import"**
5. Pilih file `flask_db.sql`
6. Klik **"Go"**

### 5. Verifikasi Database

```sql
USE flask_db;
SHOW TABLES;
```

Harus ada 4 tabel:
- `absensi` - Data absensi karyawan
- `accs_hist` - History akses face recognition
- `img_dataset` - Dataset foto wajah
- `prs_mstr` - Master data karyawan

---

## ⚙️ Konfigurasi

### Database Configuration

Edit file `app.py` jika perlu mengubah konfigurasi database:

```python
mydb = mysql.connector.connect(
    host="localhost",      # Ganti jika MySQL di server lain
    user="root",           # Ganti dengan username MySQL Anda
    passwd="",             # Ganti dengan password MySQL Anda
    database="flask_db"    # Nama database
)
```

### Webcam Configuration

Jika webcam tidak terdeteksi, ubah index kamera di `app.py`:

```python
# Baris 46 dan 189
cap = cv2.VideoCapture(0)  # Ganti 0 dengan 1, 2, dst.
```

### Path Configuration

Path sudah menggunakan relative path, tidak perlu diubah:
```python
# Haar Cascade path
"resources/haarcascade_frontalface_default.xml"

# Dataset path
"dataset"
```

---

## 🎯 Usage

### 1. Jalankan Aplikasi

```bash
python app.py
```

Output yang benar:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### 2. Akses Aplikasi

Buka browser dan akses: **http://127.0.0.1:5000**

---

## 📖 Panduan Penggunaan

### A. Registrasi Karyawan Baru

1. **Akses halaman registrasi**
   - Klik menu **"Tambah Karyawan"**
   - Atau akses: `http://127.0.0.1:5000/tambah`

2. **Isi form registrasi**
   - **ID**: Otomatis tergenerate
   - **Nama**: Masukkan nama lengkap
   - **Posisi**: Pilih (Peserta/Pengawas)

3. **Generate dataset wajah**
   - Klik **"Next"**
   - Aplikasi akan membuka webcam
   - Posisikan wajah di depan kamera
   - Sistem akan mengambil **100 foto** secara otomatis
   - Tunggu hingga progress bar mencapai 100%

4. **Train classifier**
   - Setelah generate dataset selesai
   - Klik tombol **"Train Classifier"**
   - Tunggu proses training selesai (±10-30 detik)
   - Sistem akan redirect ke halaman utama

### B. Absensi dengan Face Recognition

1. **Akses halaman face recognition**
   - Klik menu **"Face Recognition"**
   - Atau akses: `http://127.0.0.1:5000/fr_page`

2. **Proses absensi**
   - Webcam akan aktif otomatis
   - Posisikan wajah di depan kamera
   - Sistem akan mendeteksi dan mengenali wajah
   - Progress bar akan muncul (0-100%)
   - Jika confidence > 70%, absensi tercatat otomatis

3. **Konfirmasi**
   - Nama dan posisi akan muncul di layar
   - Data tersimpan di database
   - Timestamp dan lokasi GPS tercatat

### C. Absensi Manual (Alternatif)

1. **Akses halaman utama**
   - Klik tombol **"Absen Sekarang"**

2. **Isi form absensi**
   - **Person #**: ID karyawan
   - **Nama**: Nama lengkap
   - **Skill**: Posisi/jabatan
   - **Tanggal**: Otomatis terisi
   - **Waktu**: Otomatis terisi
   - **Latitude/Longitude**: Otomatis terdeteksi (izinkan akses lokasi)

3. **Capture wajah**
   - Klik tombol **"Capture"**
   - Foto wajah akan tersimpan

4. **Submit**
   - Klik **"Submit Absensi"**
   - Data tersimpan ke database

### D. Admin Panel

1. **Login admin**
   - Akses: `http://127.0.0.1:5000/admin/login`
   - **Username**: `admin`
   - **Password**: `admin123`

2. **Dashboard**
   - View semua data absensi
   - Lihat foto capture
   - Lihat koordinat GPS
   - Delete data absensi

3. **Logout**
   - Klik tombol **"Logout"**

---

## 📁 Struktur Project

```
Sistem-Absensi-Face-Recognition/
│
├── app.py                          # Main application file
├── requirements.txt                # Python dependencies
├── flask_db.sql                    # Database schema
├── classifier.xml                  # Trained face recognition model
├── README.md                       # Documentation
│
├── dataset/                        # Face images dataset
│   └── [person_id].[img_id].jpg   # Format: 101.1.jpg, 101.2.jpg, ...
│
├── resources/                      # Haar Cascade files
│   └── haarcascade_frontalface_default.xml
│
├── static/                         # Static files
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   ├── font-awesome.min.css
│   │   └── style.css
│   ├── img/
│   │   └── logo.png
│   ├── js/
│   │   └── [JavaScript files]
│   └── uploads/                    # Uploaded files
│
├── templates/                      # HTML templates
│   ├── index.html                  # Home page
│   ├── admin.html                  # Admin dashboard
│   ├── admin_login.html            # Admin login
│   ├── addprsn.html                # Add person form
│   ├── gendataset.html             # Generate dataset page
│   ├── fr_page.html                # Face recognition page
│   ├── success.html                # Success message
│   ├── error.html                  # Error message
│   ├── layout.html                 # Base layout
│   ├── head.html                   # HTML head
│   └── navbar.html                 # Navigation bar
│
└── Scripts/                        # Virtual environment (if using venv)
    └── [Python executables]
```

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| GET | `/tambah` | Add person form |
| POST | `/addprsn_submit` | Submit new person |
| GET | `/vfdataset_page/<prs>` | Generate dataset page |
| GET | `/vidfeed_dataset/<nbr>` | Video feed for dataset |
| GET | `/train_classifier/<nbr>` | Train face recognition model |
| GET | `/fr_page` | Face recognition page |
| GET | `/video_feed` | Video feed for face recognition |
| POST | `/absen` | Submit attendance |
| GET | `/countTodayScan` | Count today's scans (AJAX) |
| GET | `/loadData` | Load attendance data (AJAX) |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/admin/login` | Admin login |
| GET | `/admin` | Admin dashboard |
| GET | `/admin/logout` | Admin logout |
| POST | `/delete/<id>` | Delete attendance record |

---

## 🔧 Troubleshooting

### 1. Error: MySQL Connection Failed

**Error:**
```
mysql.connector.errors.ProgrammingError: 1049 (42000): Unknown database 'flask_db'
```

**Solusi:**
- Pastikan database `flask_db` sudah dibuat
- Import file `flask_db.sql`
- Cek konfigurasi database di `app.py`

### 2. Error: Webcam Tidak Terdeteksi

**Error:**
```
cv2.error: (-215:Assertion failed)
```

**Solusi:**
- Pastikan webcam terhubung dan tidak digunakan aplikasi lain
- Coba ganti index kamera: `cv2.VideoCapture(1)` atau `cv2.VideoCapture(2)`
- Restart aplikasi

### 3. Error: classifier.xml Not Found

**Error:**
```
cv2.error: OpenCV(4.10.0) error: (-2:Unspecified error)
```

**Solusi:**
- Lakukan training classifier terlebih dahulu
- Pastikan sudah ada data di folder `dataset/`
- Akses: `/train_classifier/<person_id>`

### 4. Error: Folder Dataset Kosong

**Error:**
```
FileNotFoundError: [WinError 3] The system cannot find the path specified: 'dataset'
```

**Solusi:**
- Buat folder `dataset` di root project
- Atau jalankan: `mkdir dataset`

### 5. Error: Face Not Recognized

**Masalah:**
- Wajah terdeteksi tapi selalu "UNKNOWN"

**Solusi:**
- Pastikan sudah melakukan training classifier
- Generate lebih banyak dataset (100 foto)
- Pastikan pencahayaan cukup
- Posisikan wajah lebih dekat ke kamera

### 6. Error: PowerShell Redirect Not Supported

**Error:**
```
The '<' operator is reserved for future use.
```

**Solusi:**
```powershell
# Gunakan Get-Content
Get-Content flask_db.sql | mysql -u root -p
```

### 7. Error: Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'cv2'
```

**Solusi:**
```bash
pip install opencv-contrib-python==4.10.0.82
```

---

## 🎨 Customization

### Mengubah Confidence Threshold

Edit `app.py` baris 127:
```python
if confidence > 70 and not justscanned:  # Ubah 70 menjadi nilai lain (0-100)
```

### Mengubah Jumlah Dataset

Edit `app.py` baris 52:
```python
max_imgid = img_id + 100  # Ubah 100 menjadi jumlah foto yang diinginkan
```

### Mengubah Admin Credentials

Edit `app.py` baris 223:
```python
if username == 'admin' and password == 'admin123':  # Ubah username dan password
```

### Mengubah Port Aplikasi

Edit `app.py` baris terakhir:
```python
app.run(host='127.0.0.1', port=5000, debug=True)  # Ubah port 5000
```

---

## 🧪 Testing

### Manual Testing

1. **Test Face Detection**
   ```bash
   python -c "import cv2; print(cv2.__version__)"
   ```

2. **Test Database Connection**
   ```bash
   mysql -u root -p -e "USE flask_db; SHOW TABLES;"
   ```

3. **Test Webcam**
   ```python
   import cv2
   cap = cv2.VideoCapture(0)
   ret, frame = cap.read()
   print("Webcam OK" if ret else "Webcam Error")
   cap.release()
   ```

---

## 🚀 Deployment

### Deploy ke Production

1. **Ubah Debug Mode**
   ```python
   app.run(host='0.0.0.0', port=5000, debug=False)
   ```

2. **Gunakan WSGI Server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Setup Nginx (Opsional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
       }
   }
   ```

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Coding Standards
- Gunakan PEP 8 untuk Python code
- Tambahkan docstring untuk fungsi baru
- Test sebelum submit PR

---

## 👨‍💻 Contact

**Project Maintainer**: Noel

- Email: noelgrevansha@gmail.com
- GitHub: [nowelliswell]([https://github.com/yourusername](https://github.com/nowelliswell))
- LinkedIn: [Noelino Grevansha]([https://linkedin.com/in/yourprofile](https://www.linkedin.com/in/noelino-grevansha-b4ba19215/))

**Project Link**: [https://github.com/yourusername/Sistem-Absensi-Face-Recognition](https://github.com/yourusername/Sistem-Absensi-Face-Recognition)

---

## 🙏 Acknowledgments

- [Flask Documentation](https://flask.palletsprojects.com/)
- [OpenCV Documentation](https://docs.opencv.org/)
- [Bootstrap](https://getbootstrap.com/)
- [MySQL](https://www.mysql.com/)
- [Haar Cascade Classifiers](https://github.com/opencv/opencv/tree/master/data/haarcascades)

---

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-green.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)

---

## 🗺️ Roadmap

- [x] Face detection & recognition
- [x] Admin panel
- [x] Geolocation tracking
- [ ] Export data to Excel/PDF
- [ ] Email notification
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Cloud deployment
- [ ] API documentation (Swagger)
- [ ] Unit testing

---

<div align="center">

**⭐ Jika project ini membantu, berikan star ya! ⭐**

Made with ❤️ by Noel

</div>
