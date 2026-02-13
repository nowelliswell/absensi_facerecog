# 🔄 Retrain Classifier Guide

## ⚠️ PENTING: Harus Retrain!

Setelah fix backend, classifier HARUS di-retrain dengan logic yang baru.

## 🎯 Kenapa Harus Retrain?

**Sebelum Fix:**
- Training menggunakan `img_id` (1, 2, 3, ... 100) sebagai label
- Model belajar: 100 orang berbeda
- Result: Tidak bisa recognize

**Setelah Fix:**
- Training menggunakan `person_id` (102, 102, 102, ... 102) sebagai label
- Model belajar: 1 orang yang sama
- Result: Bisa recognize dengan confidence tinggi ✅

## 🚀 Cara Retrain

### Option 1: Via API (Recommended)

```bash
curl -X POST http://localhost:5000/api/face/train/102
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Classifier trained successfully",
  "total_images": 100,
  "unique_persons": 1
}
```

### Option 2: Via Frontend

1. Login ke admin panel: `http://localhost:8082/login`
   - Username: `admin`
   - Password: `admin123`

2. Go to "Register Employee" tab

3. Scroll ke bawah, klik tombol "Train Classifier"

4. Tunggu hingga selesai (±5-10 detik)

5. Success message akan muncul

### Option 3: Via Python Script

```python
import requests

response = requests.post('http://localhost:5000/api/face/train/102')
print(response.json())
```

## ✅ Verify Training Berhasil

### 1. Check File classifier.xml

```bash
# Check if file exists and updated
ls -la backend/classifier.xml
```

File harus ada dan timestamp harus baru (setelah retrain).

### 2. Test Recognition

```bash
# Test via API
curl -X POST http://localhost:5000/api/face/recognize \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'
```

### 3. Test Live Recognition

1. Buka: `http://localhost:8082/recognition`
2. Webcam aktif
3. Posisikan wajah
4. Harus recognize dengan confidence >70%

## 📊 Training Output

**Success:**
```json
{
  "success": true,
  "message": "Classifier trained successfully",
  "total_images": 100,
  "unique_persons": 1
}
```

**Meaning:**
- `total_images: 100` - 100 foto digunakan untuk training
- `unique_persons: 1` - 1 orang (person_id = 102)

**Failed:**
```json
{
  "success": false,
  "message": "No images found in dataset"
}
```

**Solution:**
- Check folder `backend/dataset/`
- Harus ada file `102.1.jpg` sampai `102.100.jpg`

## 🔧 Troubleshooting

### Issue: "Dataset directory not found"

**Solution:**
```bash
# Create dataset folder
mkdir backend/dataset

# Copy images
# Pastikan ada file 102.1.jpg sampai 102.100.jpg
```

### Issue: "No images found in dataset"

**Solution:**
```bash
# Check dataset folder
ls backend/dataset/*.jpg

# Should show:
# 102.1.jpg, 102.2.jpg, ... 102.100.jpg
```

### Issue: "No valid faces found"

**Possible Causes:**
- Image files corrupt
- Wrong format
- Not grayscale convertible

**Solution:**
- Re-generate dataset
- Check image files manually

### Issue: Training takes too long

**Normal:**
- 100 images = ~5-10 seconds
- 1000 images = ~30-60 seconds

**Too Long (>2 minutes):**
- Check CPU usage
- Check if other processes running
- Restart backend

## 📝 Training Process

```
1. Load all images from dataset/
   ├── 102.1.jpg
   ├── 102.2.jpg
   └── ... (100 files)

2. Parse filename
   ├── person_id = 102
   └── img_id = 1, 2, 3, ...

3. Convert to grayscale
   └── 200x200 pixels

4. Create training data
   ├── faces = [img1, img2, ..., img100]
   └── labels = [102, 102, ..., 102]

5. Train LBPH model
   └── clf.train(faces, labels)

6. Save model
   └── classifier.xml
```

## 🎯 After Retrain

### Test Recognition

**Via Live Stream:**
1. `http://localhost:8082/recognition`
2. Webcam aktif
3. Show face
4. Should recognize with name + confidence

**Via Attendance:**
1. `http://localhost:8082/attendance`
2. Click "Capture & Clock In"
3. Should recognize and record attendance

**Expected Result:**
```
Name: [Employee Name]
Position: PESERTA
Confidence: 95%
Status: Recognized ✅
```

## 📊 Confidence Levels

| Confidence | Meaning | Action |
|------------|---------|--------|
| 90-100% | Excellent match | Auto clock-in ✅ |
| 70-89% | Good match | Auto clock-in ✅ |
| 50-69% | Uncertain | Manual verify ⚠️ |
| <50% | No match | Reject ❌ |

**Current Threshold:** 70%

To change threshold, edit `backend/api.py`:
```python
if confidence_score > 70:  # Change this value
```

## 🎉 Success Indicators

✅ Training completed without errors
✅ classifier.xml file updated
✅ total_images = 100
✅ unique_persons = 1
✅ Live recognition works
✅ Confidence > 70%
✅ Employee name displayed correctly

## 📞 Need Help?

Check these files:
- `BACKEND_FIX_SUMMARY.md` - What was fixed
- `LOGIN_TROUBLESHOOTING.md` - Login issues
- `AUTHENTICATION_GUIDE.md` - Auth system

---

**Status:** ⏳ Waiting for retrain

**Next:** Retrain classifier, then test recognition

**Last Updated:** February 13, 2026
