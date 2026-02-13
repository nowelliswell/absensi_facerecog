import cv2
import base64
import requests
import json

# Read test image from dataset
img_path = "dataset/102.1.jpg"
img = cv2.imread(img_path)

if img is None:
    print(f"Error: Could not read image {img_path}")
    exit(1)

# Convert to base64
_, buffer = cv2.imencode('.jpg', img)
img_base64 = base64.b64encode(buffer).decode('utf-8')
img_data = f"data:image/jpeg;base64,{img_base64}"

# Send to API
url = "http://localhost:5000/api/face/recognize"
payload = {"image": img_data}
headers = {"Content-Type": "application/json"}

print("Testing face recognition with dataset image...")
print(f"Image: {img_path}")
print(f"Image shape: {img.shape}")
print()

response = requests.post(url, json=payload, headers=headers)
result = response.json()

print("Response:")
print(json.dumps(result, indent=2))

if result.get('success') and result.get('recognized'):
    employee = result.get('employee', {})
    print(f"\n✅ SUCCESS!")
    print(f"Name: {employee.get('name')}")
    print(f"ID: {employee.get('id')}")
    print(f"Position: {employee.get('position')}")
    print(f"Confidence: {employee.get('confidence')}%")
else:
    print(f"\n❌ FAILED: {result.get('message')}")
