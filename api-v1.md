/\*
=== LOGIN ===
POST {{base_url}}/api/v1/auth/login
Content-Type: application/json

{
"username": "john.doe",
"password": "password123",
}

Response:
{
"success": true,
"message": "Login successful",
"data": {
"token": "1|abc123...",
"user": {...},
"employee": {...}
},
"meta": {
"timestamp": "2024-01-01T10:00:00Z",
"version": "v1"
}
}

=== MOBILE CHECK-IN ===
POST {{base_url}}/api/v1/attendance/check-in/mobile
Authorization: Bearer {{token}}
Content-Type: application/json

{
"latitude": -6.200000,
"longitude": 106.816666,
"photo": "/storage/attendance/checkin_123.jpg",
}

=== RFID CHECK-IN (for Python integration) ===
POST {{base_url}}/api/v1/attendance/check-in/rfid
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
"rfid_number": "1234567890",
"rfid_device_id": 1,
"work_location_id": 1,
"photo_path": "/storage/rfid/photo_123.jpg",
"timestamp": "2024-01-01 08:00:00"
}

=== GET TODAY ATTENDANCE ===
GET {{base_url}}/api/v1/attendance/today
Authorization: Bearer {{token}}

=== GET ATTENDANCE HISTORY ===
GET {{base_url}}/api/v1/attendance/history?month=1&year=2024&per_page=20
Authorization: Bearer {{token}}

=== LOGOUT ===
POST {{base_url}}/api/v1/auth/logout
Authorization: Bearer {{token}}
Content-Type: application/json

{
"device_id": "device_12345"
}
