from flask import Flask, request, jsonify, Response, session
from flask_cors import CORS
import mysql.connector
import cv2
from PIL import Image
import numpy as np
import os
import time
from datetime import date, datetime
import logging
import base64

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'noeltoktil'
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:8082", "http://localhost:8081", "http://localhost:3000"]}}, supports_credentials=True)

cnt = 0
pause_cnt = 0
justscanned = False

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="",
        database="flask_db"
    )

# ==================== AUTH ENDPOINTS ====================

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == 'admin' and password == 'admin123':
        session['admin_logged_in'] = True
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {'username': username, 'role': 'admin'}
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.pop('admin_logged_in', None)
    return jsonify({'success': True, 'message': 'Logged out'})

@app.route('/api/auth/me', methods=['GET'])
def api_me():
    if 'admin_logged_in' in session:
        return jsonify({
            'success': True,
            'user': {'username': 'admin', 'role': 'admin'}
        })
    return jsonify({'success': False}), 401

# ==================== EMPLOYEES ENDPOINTS ====================

@app.route('/api/employees', methods=['GET'])
def get_employees():
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute("SELECT prs_nbr, prs_name, prs_skill, prs_active, prs_added FROM prs_mstr")
    employees = mycursor.fetchall()
    
    result = []
    for emp in employees:
        result.append({
            'id': emp[0],
            'name': emp[1],
            'position': emp[2],
            'active': emp[3],
            'createdAt': emp[4].isoformat() if emp[4] else None
        })
    
    mydb.close()
    return jsonify({'success': True, 'data': result})

@app.route('/api/employees/next-id', methods=['GET'])
def get_next_employee_id():
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute("SELECT IFNULL(MAX(prs_nbr) + 1, 101) FROM prs_mstr")
    row = mycursor.fetchone()
    next_id = row[0]
    
    mydb.close()
    return jsonify({'success': True, 'nextId': int(next_id)})

@app.route('/api/employees/register', methods=['POST'])
def register_employee():
    data = request.json
    emp_id = data.get('id')
    name = data.get('name')
    position = data.get('position')
    
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    try:
        mycursor.execute(
            "INSERT INTO prs_mstr (prs_nbr, prs_name, prs_skill) VALUES (%s, %s, %s)",
            (emp_id, name, position)
        )
        mydb.commit()
        mydb.close()
        
        return jsonify({
            'success': True,
            'message': 'Employee registered successfully',
            'employeeId': emp_id
        })
    except Exception as e:
        mydb.close()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== FACE RECOGNITION ENDPOINTS ====================

def generate_dataset_api(nbr):
    """Generate dataset for face recognition"""
    face_classifier = cv2.CascadeClassifier("resources/haarcascade_frontalface_default.xml")
    
    def face_cropped(img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, 1.3, 7)
        
        if len(faces) == 0:
            return None
        for (x, y, w, h) in faces:
            cropped_face = img[y:y + h, x:x + w]
        return cropped_face
    
    cap = cv2.VideoCapture(0)
    
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    mycursor.execute("SELECT IFNULL(MAX(img_id), 0) FROM img_dataset")
    row = mycursor.fetchone()
    lastid = row[0]
    
    img_id = lastid
    max_imgid = img_id + 100
    count_img = 0
    
    while True:
        ret, img = cap.read()
        if face_cropped(img) is not None:
            count_img += 1
            img_id += 1
            face = cv2.resize(face_cropped(img), (200, 200))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            
            file_name_path = f"dataset/{nbr}.{img_id}.jpg"
            cv2.imwrite(file_name_path, face)
            cv2.putText(face, str(count_img), (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
            
            mycursor.execute(
                "INSERT INTO img_dataset (img_id, img_person) VALUES (%s, %s)",
                (img_id, nbr)
            )
            mydb.commit()
            
            frame = cv2.imencode('.jpg', face)[1].tobytes()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
            if cv2.waitKey(1) == 13 or int(img_id) == int(max_imgid):
                break
    
    cap.release()
    cv2.destroyAllWindows()
    mydb.close()

@app.route('/api/face/dataset/<nbr>')
def api_generate_dataset(nbr):
    """Video streaming route for dataset generation"""
    return Response(
        generate_dataset_api(nbr),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/api/face/train/<nbr>', methods=['POST'])
def api_train_classifier(nbr):
    """Train face recognition classifier"""
    try:
        dataset_dir = "dataset"
        
        # Get all image files
        if not os.path.exists(dataset_dir):
            return jsonify({'success': False, 'message': 'Dataset directory not found'}), 404
        
        image_files = [f for f in os.listdir(dataset_dir) if f.endswith('.jpg')]
        
        if len(image_files) == 0:
            return jsonify({'success': False, 'message': 'No images found in dataset'}), 404
        
        faces = []
        labels = []
        
        for image_file in image_files:
            try:
                # Parse filename: person_id.img_id.jpg (e.g., 102.1.jpg)
                parts = image_file.split('.')
                if len(parts) >= 3:
                    person_id = int(parts[0])  # Use person_id as label (102)
                    
                    # Load and process image
                    img_path = os.path.join(dataset_dir, image_file)
                    img = Image.open(img_path).convert('L')
                    img_array = np.array(img, 'uint8')
                    
                    faces.append(img_array)
                    labels.append(person_id)
            except Exception as e:
                print(f"Error processing {image_file}: {e}")
                continue
        
        if len(faces) == 0:
            return jsonify({'success': False, 'message': 'No valid faces found'}), 400
        
        labels = np.array(labels)
        
        # Train the classifier
        clf = cv2.face.LBPHFaceRecognizer_create()
        clf.train(faces, labels)
        clf.write("classifier.xml")
        
        # Get unique persons count
        unique_persons = len(set(labels))
        
        return jsonify({
            'success': True,
            'message': 'Classifier trained successfully',
            'total_images': len(faces),
            'unique_persons': unique_persons
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/face/recognize', methods=['POST'])
def api_recognize_face():
    """Recognize face from base64 image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'success': False, 'message': 'No image provided'}), 400
        
        # Check if classifier exists
        if not os.path.exists("classifier.xml"):
            return jsonify({
                'success': False,
                'message': 'Classifier not trained yet. Please train the model first.'
            }), 400
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        print(f"[DEBUG] Image decoded, shape: {img.shape}")
        
        # Load classifier
        clf = cv2.face.LBPHFaceRecognizer_create()
        clf.read("classifier.xml")
        
        # Detect face with more lenient parameters
        face_classifier = cv2.CascadeClassifier("resources/haarcascade_frontalface_default.xml")
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Try multiple detection parameters
        faces = face_classifier.detectMultiScale(gray, 1.1, 4, minSize=(30, 30))
        
        print(f"[DEBUG] Faces detected: {len(faces)}")
        
        if len(faces) == 0:
            # Try again with even more lenient parameters
            faces = face_classifier.detectMultiScale(gray, 1.05, 3, minSize=(20, 20))
            print(f"[DEBUG] Retry detection, faces found: {len(faces)}")
        
        if len(faces) == 0:
            return jsonify({
                'success': False,
                'message': 'No face detected in image'
            })
        
        # Use the largest face detected
        faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
        
        for (x, y, w, h) in faces[:1]:  # Only process the largest face
            face_roi = gray[y:y + h, x:x + w]
            # Resize to match training size
            face_roi = cv2.resize(face_roi, (200, 200))
            person_id, confidence = clf.predict(face_roi)  # person_id is now 102, not img_id
            confidence_score = int(100 * (1 - confidence / 300))
            
            print(f"[DEBUG] Predicted person_id: {person_id}, confidence: {confidence}, score: {confidence_score}%")
            
            # Lower threshold to 60% for better recognition
            if confidence_score > 60:
                # Get employee info using person_id
                mydb = get_db_connection()
                mycursor = mydb.cursor()
                mycursor.execute(
                    """SELECT prs_nbr, prs_name, prs_skill 
                       FROM prs_mstr 
                       WHERE prs_nbr = %s""",
                    (str(person_id),)
                )
                row = mycursor.fetchone()
                mydb.close()
                
                if row:
                    return jsonify({
                        'success': True,
                        'recognized': True,
                        'employee': {
                            'id': row[0],
                            'name': row[1],
                            'position': row[2],
                            'confidence': confidence_score
                        }
                    })
        
        return jsonify({
            'success': True,
            'recognized': False,
            'message': 'Face not recognized or confidence too low'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ATTENDANCE ENDPOINTS ====================

@app.route('/api/attendance/clock-in', methods=['POST'])
def api_clock_in():
    """Clock in attendance"""
    data = request.json
    emp_id = data.get('employeeId')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    try:
        # Get employee info
        mycursor.execute(
            "SELECT prs_name, prs_skill FROM prs_mstr WHERE prs_nbr = %s",
            (emp_id,)
        )
        emp = mycursor.fetchone()
        
        if not emp:
            mydb.close()
            return jsonify({'success': False, 'message': 'Employee not found'}), 404
        
        # Check if already checked in today
        mycursor.execute(
            """SELECT id, waktu FROM absensi 
               WHERE person = %s AND tanggal = CURDATE()""",
            (emp_id,)
        )
        existing = mycursor.fetchone()
        
        if existing:
            mydb.close()
            return jsonify({
                'success': False, 
                'message': f'Anda sudah check-in hari ini pada {existing[1]}',
                'already_checked_in': True,
                'check_in_time': existing[1]
            }), 400
        
        # Record attendance
        now = datetime.now()
        mycursor.execute(
            """INSERT INTO absensi (person, nama, skill, tanggal, waktu, latitude, longitude) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (emp_id, emp[0], emp[1], now.date(), now.strftime('%H:%M:%S'), latitude, longitude)
        )
        
        # Also record in accs_hist
        mycursor.execute(
            "INSERT INTO accs_hist (accs_date, accs_prsn) VALUES (%s, %s)",
            (now.date(), emp_id)
        )
        
        mydb.commit()
        mydb.close()
        
        return jsonify({
            'success': True,
            'message': 'Attendance recorded successfully',
            'data': {
                'employeeId': emp_id,
                'name': emp[0],
                'position': emp[1],
                'time': now.strftime('%H:%M:%S'),
                'date': now.date().isoformat()
            }
        })
    except Exception as e:
        mydb.close()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/attendance/today', methods=['GET'])
def api_attendance_today():
    """Get today's attendance"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute(
        """SELECT a.id, a.person, a.nama, a.skill, a.tanggal, a.waktu, a.latitude, a.longitude
           FROM absensi a
           WHERE a.tanggal = CURDATE()
           ORDER BY a.waktu DESC"""
    )
    attendance = mycursor.fetchall()
    
    result = []
    for att in attendance:
        # Determine status (on-time if before 9 AM)
        time_obj = datetime.strptime(att[5], '%H:%M:%S').time()
        status = 'on-time' if time_obj.hour < 9 else 'late'
        
        result.append({
            'id': att[0],
            'employeeId': att[1],
            'employeeName': att[2],
            'department': att[3],
            'date': att[4].isoformat() if att[4] else None,
            'clockIn': att[5],
            'clockOut': None,
            'status': status,
            'confidence': 95,  # Mock confidence
            'latitude': att[6],
            'longitude': att[7]
        })
    
    mydb.close()
    return jsonify({'success': True, 'data': result})

@app.route('/api/attendance/history', methods=['GET'])
def api_attendance_history():
    """Get attendance history"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute(
        """SELECT a.id, a.person, a.nama, a.skill, a.tanggal, a.waktu
           FROM absensi a
           ORDER BY a.tanggal DESC, a.waktu DESC
           LIMIT 100"""
    )
    attendance = mycursor.fetchall()
    
    result = []
    for att in attendance:
        result.append({
            'id': att[0],
            'employeeId': att[1],
            'employeeName': att[2],
            'department': att[3],
            'date': att[4].isoformat() if att[4] else None,
            'clockIn': att[5]
        })
    
    mydb.close()
    return jsonify({'success': True, 'data': result})

@app.route('/api/attendance/<int:id>', methods=['DELETE'])
def api_delete_attendance(id):
    """Delete attendance record"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    try:
        mycursor.execute("DELETE FROM absensi WHERE id = %s", (id,))
        mydb.commit()
        mydb.close()
        
        return jsonify({'success': True, 'message': 'Attendance deleted'})
    except Exception as e:
        mydb.close()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DASHBOARD ENDPOINTS ====================

@app.route('/api/dashboard/stats', methods=['GET'])
def api_dashboard_stats():
    """Get dashboard statistics"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    # Total employees
    mycursor.execute("SELECT COUNT(*) FROM prs_mstr WHERE prs_active = 'Y'")
    total_employees = mycursor.fetchone()[0]
    
    # Today's attendance (count unique persons)
    mycursor.execute("SELECT COUNT(DISTINCT person) FROM absensi WHERE tanggal = CURDATE()")
    today_present = mycursor.fetchone()[0]
    
    # Late arrivals (unique persons who came after 9 AM)
    mycursor.execute(
        """SELECT COUNT(DISTINCT person) FROM absensi 
           WHERE tanggal = CURDATE() AND TIME(waktu) > '09:00:00'"""
    )
    late_arrivals = mycursor.fetchone()[0]
    
    # Absent today
    absent_today = max(0, total_employees - today_present)
    
    mydb.close()
    
    return jsonify({
        'success': True,
        'data': {
            'totalEmployees': total_employees,
            'todayPresent': today_present,
            'lateArrivals': late_arrivals,
            'absentToday': absent_today
        }
    })

@app.route('/api/dashboard/weekly', methods=['GET'])
def api_weekly_attendance():
    """Get weekly attendance data"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute("""
        SELECT 
            DAYNAME(tanggal) as day,
            COUNT(*) as present,
            SUM(CASE WHEN TIME(waktu) > '09:00:00' THEN 1 ELSE 0 END) as late
        FROM absensi
        WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY tanggal, DAYNAME(tanggal)
        ORDER BY tanggal
    """)
    
    weekly_data = mycursor.fetchall()
    mydb.close()
    
    result = []
    for row in weekly_data:
        result.append({
            'day': row[0],
            'present': row[1],
            'late': row[2]
        })
    
    return jsonify({'success': True, 'data': result})

@app.route('/api/dashboard/monthly', methods=['GET'])
def api_monthly_trend():
    """Get monthly attendance trend"""
    mydb = get_db_connection()
    mycursor = mydb.cursor()
    
    mycursor.execute("""
        SELECT 
            DATE_FORMAT(tanggal, '%b') as month,
            COUNT(*) * 100.0 / (SELECT COUNT(*) FROM prs_mstr WHERE prs_active = 'Y') as rate
        FROM absensi
        WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(tanggal), MONTH(tanggal)
        ORDER BY tanggal
    """)
    
    monthly_data = mycursor.fetchall()
    mydb.close()
    
    result = []
    for row in monthly_data:
        result.append({
            'month': row[0],
            'rate': round(float(row[1]), 1)
        })
    
    return jsonify({'success': True, 'data': result})

# ==================== VIDEO STREAMING ====================

def face_recognition_stream():
    """Generate frame by frame from camera for face recognition"""
    global justscanned, pause_cnt, cnt
    
    def draw_boundary(img, classifier, scaleFactor, minNeighbors, color, text, clf):
        global justscanned, pause_cnt, cnt
        
        gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        features = classifier.detectMultiScale(gray_image, scaleFactor, minNeighbors)
        
        pause_cnt += 1
        coords = []
        
        for (x, y, w, h) in features:
            cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
            person_id, pred = clf.predict(gray_image[y:y + h, x:x + w])  # person_id is now 102
            confidence = int(100 * (1 - pred / 300))
            
            if confidence > 70 and not justscanned:
                cnt += 1
                n = (100 / 30) * cnt
                w_filled = (cnt / 30) * w
                
                cv2.putText(img, str(int(n))+' %', (x + 20, y + h + 28), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
                
                cv2.rectangle(img, (x, y + h + 40), (x + w, y + h + 50), color, 2)
                cv2.rectangle(img, (x, y + h + 40), (x + int(w_filled), y + h + 50), 
                             (255, 255, 255), cv2.FILLED)
                
                mydb = get_db_connection()
                mycursor = mydb.cursor()
                # Query using person_id directly
                mycursor.execute(
                    """SELECT prs_nbr, prs_name, prs_skill 
                       FROM prs_mstr 
                       WHERE prs_nbr = %s""",
                    (str(person_id),)
                )
                row = mycursor.fetchone()
                
                if row:
                    pnbr = row[0]
                    pname = row[1]
                    pskill = row[2]
                    
                    if int(cnt) == 30:
                        cnt = 0
                        mycursor.execute(
                            "INSERT INTO accs_hist (accs_date, accs_prsn) VALUES (%s, %s)",
                            (str(date.today()), pnbr)
                        )
                        mydb.commit()
                        
                        cv2.putText(img, pname + ' | ' + pskill, (x - 10, y - 10), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (153, 255, 255), 2, cv2.LINE_AA)
                        time.sleep(1)
                        
                        justscanned = True
                        pause_cnt = 0
                else:
                    cv2.putText(img, 'UNKNOWN', (x, y - 5), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
                    cnt = 0
                
                mydb.close()
            else:
                if not justscanned:
                    cv2.putText(img, 'UNKNOWN', (x, y - 5), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
                
                if pause_cnt > 80:
                    justscanned = False
            
            coords = [x, y, w, h]
        
        return coords
    
    def recognize(img, clf, faceCascade):
        coords = draw_boundary(img, faceCascade, 1.1, 10, (0, 0, 255), "Face", clf)
        return img
    
    faceCascade = cv2.CascadeClassifier("resources/haarcascade_frontalface_default.xml")
    clf = cv2.face.LBPHFaceRecognizer_create()
    clf.read("classifier.xml")
    
    cap = cv2.VideoCapture(0)
    cap.set(3, 400)
    cap.set(4, 400)
    
    while True:
        ret, img = cap.read()
        if not ret:
            break
        
        img = recognize(img, clf, faceCascade)
        
        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        
        if cv2.waitKey(1) == 27:
            break
    
    cap.release()

@app.route('/api/video/recognition')
def api_video_recognition():
    """Video streaming route for face recognition"""
    return Response(
        face_recognition_stream(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'success': True,
        'message': 'API is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='127.0.0.1', port=5000, debug=True)
