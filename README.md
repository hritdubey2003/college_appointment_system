# Student Appointment Booking System API Documentation

This document provides detailed information about the available endpoints in the Student Appointment Booking System API.

## Base URL
`http://localhost:3000`

---

## Student Endpoints

### 1. **POST /students/register**
Registers a new student.

#### Request:
- **URL:** `/students/register`
- **Method:** POST
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "password123",
  "rollno": "CSE21128",
  "branch": "CSE",
  "batch": "2023"
}
```

#### Response:
- **201 Created**
```json
{
  "student": {
    "_id": "61234abcd1234abcd1234",
    "name": "John Doe",
    "email": "student@example.com",
    "rollno": "CSE21128",
    "branch": "CSE",
    "batch": "2023"
  },
  "token": "access_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Errors:
- **400 Bad Request:** Missing required fields.
- **500 Internal Server Error:** Registration failed.

---

### 2. **POST /students/login**
Authenticates a student and generates access and refresh tokens.

#### Request:
- **URL:** `/students/login`
- **Method:** POST
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

#### Response:
- **200 OK**
```json
{
  "student": {
    "_id": "61234abcd1234abcd1234",
    "name": "John Doe",
    "email": "student@example.com",
    "rollno": "CSE21128",
    "branch": "CSE",
    "batch": "2023"
  },
  "token": "access_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Errors:
- **400 Bad Request:** Missing or incorrect credentials.
- **500 Internal Server Error:** Login failed.

---

### 3. **GET /students/logout**
Logs out the student by clearing authentication cookies.

#### Request:
- **URL:** `/students/logout`
- **Method:** GET

#### Response:
- **200 OK**
```json
{
  "message": "Logout is Successful!"
}
```

#### Errors:
- **501 Not Implemented:** Logout process failed.

---

### 4. **GET /students/getProfessorsList**
Fetches the list of available time slots for professors.

#### Request:
- **URL:** `/students/getProfessorsList`
- **Method:** GET
- **Authentication:** Requires student authentication (JWT).

#### Response:
- **200 OK**
```json
{
  "availability": [
    {
      "professor": {
        "_id": "prof12345",
        "name": "Prof. Smith",
        "email": "profsmith@example.com",
        "department": "CSE"
      },
      "date": "2025-01-10",
      "time_slot": "10:00 AM - 11:00 AM"
    }
  ]
}
```

#### Errors:
- **404 Not Found:** No professors available.
- **501 Not Implemented:** Failed to fetch time slots.

---

### 5. **POST /students/bookTimeSlot**
Books an available time slot with a professor.

#### Request:
- **URL:** `/students/bookTimeSlot`
- **Method:** POST
- **Content-Type:** `application/json`
- **Authentication:** Requires student authentication (JWT).

#### Request Body:
```json
{
  "professorId": "prof12345",
  "date": "2025-01-10",
  "timeSlot": "10:00 AM - 11:00 AM"
}
```

#### Response:
- **201 Created**
```json
{
  "message": "Appointment booked successfully!",
  "appointment": {
    "_id": "appointment12345",
    "student": "student12345",
    "professor": "prof12345",
    "date": "2025-01-10",
    "timeSlot": "10:00 AM - 11:00 AM",
    "status": "Booked"
  }
}
```

#### Errors:
- **400 Bad Request:** Missing fields or time slot not available.
- **500 Internal Server Error:** Booking failed.

---

### 6. **POST /students/cancelAppointment**
Cancels an existing appointment.

#### Request:
- **URL:** `/students/cancelAppointment`
- **Method:** POST
- **Content-Type:** `application/json`
- **Authentication:** Requires student authentication (JWT).

#### Request Body:
```json
{
  "appointmentId": "appointment12345"
}
```

#### Response:
- **200 OK**
```json
{
  "message": "Appointment cancelled successfully!"
}
```

#### Errors:
- **404 Not Found:** Appointment not found or not owned by the user.
- **500 Internal Server Error:** Cancellation failed.

---

## Professor Endpoints

### 1. **POST /professors/register**
Registers a new professor.

#### Request:
- **URL:** `/professors/register`
- **Method:** POST
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "name": "Prof. Smith",
  "email": "professor@example.com",
  "password": "password123",
  "department": "CSE"
}
```

#### Response:
- **201 Created**
```json
{
  "professor": {
    "_id": "prof12345",
    "name": "Prof. Smith",
    "email": "professor@example.com",
    "department": "CSE"
  },
  "token": "access_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Errors:
- **400 Bad Request:** Missing required fields.
- **500 Internal Server Error:** Registration failed.

---

### 2. **POST /professors/login**
Authenticates a professor and generates access and refresh tokens.

#### Request:
- **URL:** `/professors/login`
- **Method:** POST
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "email": "professor@example.com",
  "password": "password123"
}
```

#### Response:
- **200 OK**
```json
{
  "professor": {
    "_id": "prof12345",
    "name": "Prof. Smith",
    "email": "professor@example.com",
    "department": "CSE"
  },
  "token": "access_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Errors:
- **400 Bad Request:** Missing or incorrect credentials.
- **500 Internal Server Error:** Login failed.

---

### 3. **POST /professors/setAvailability**
Creates availability for a professor to accept student appointments.

#### Request:
- **URL:** `/professors/setAvailability`
- **Method:** POST
- **Content-Type:** `application/json`
- **Authentication:** Requires professor authentication (JWT).

#### Request Body:
```json
{
  "date": "2025-01-10",
  "startTime": "12:00",
  "endTime": "13:00"
}
```

#### Response:
- **201 Created**
```json
{
  "message": "Availability created successfully!",
  "availability": {
    "_id": "avail12345",
    "professor": "prof12345",
    "date": "2025-01-10",
    "timeSlots": ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"]
  }
}
```

#### Errors:
- **400 Bad Request:** Missing fields or invalid data.
- **500 Internal Server Error:** Availability creation failed.

---

### 4. **POST /professors/deleteTimeSlot**
Deletes a specific time slot from a professor's availability.

#### Request:
- **URL:** `/professors/deleteTimeSlot`
- **Method:** POST
- **Content-Type:** `application/json`
- **Authentication:** Requires professor authentication (JWT).

#### Request Body:
```json
{
  "availabilityId": "avail12345",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

#### Response:
- **200 OK**
```json
{
  "message": "Time slot deleted successfully!"
}
```

#### Errors:
- **404 Not Found:** Availability not found.
- **500 Internal Server Error:** Deletion failed.

---

### 5. **GET /professors/logout**
Logs out the professor by clearing authentication cookies.

#### Request:
- **URL:** `/professors/logout`
- **Method:** GET

#### Response:
- **200 OK**
```json
{
  "message": "Logout is Successful!"
}
```

#### Errors:
- **501 Not Implemented:** Logout process failed.

---

## Authentication
All routes that require authentication use a JWT-based mechanism. Tokens are returned upon successful login and must be included in subsequent requests as part of the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

---

## Error Codes
| Status Code | Description               |
|-------------|---------------------------|
| 200         | OK                         |
| 201         | Created                    |
| 400         | Bad Request                |
| 404         | Not Found                  |
| 500         | Internal Server Error      |
| 501         | Not Implemented            |

---

## Notes
- Ensure your requests have the correct `Content-Type` header.
- Use `Authorization` headers for routes that require authentication.

For any further questions, please contact the API development team.

