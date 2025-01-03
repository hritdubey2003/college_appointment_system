# Student Appointment Booking System API Documentation

This document provides detailed information about the available endpoints in the Student Appointment Booking System API.

## Base URL

`http://localhost:3000/students`

---

## Endpoints

### 1. **POST /register**

Registers a new student.

#### Request:

- **URL:** `/register`
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

### 2. **POST /login**

Authenticates a student and generates access and refresh tokens.

#### Request:

- **URL:** `/login`
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

### 3. **GET /logout**

Logs out the student by clearing authentication cookies.

#### Request:

- **URL:** `/logout`
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

### 4. **GET /getProfessorsList**

Fetches the list of available time slots for professors.

#### Request:

- **URL:** `/getProfessorsList`
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

### 5. **POST /bookTimeSlot**

Books an available time slot with a professor.

#### Request:

- **URL:** `/bookTimeSlot`
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

### 6. **POST /cancelAppointment**

Cancels an existing appointment.

#### Request:

- **URL:** `/cancelAppointment`
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

### Authentication

All routes that require authentication use a JWT-based mechanism. Tokens are returned upon successful login and must be included in subsequent requests as part of the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

---

## Error Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 201         | Created               |
| 400         | Bad Request           |
| 404         | Not Found             |
| 500         | Internal Server Error |
| 501         | Not Implemented       |

---

## Notes

- Ensure your requests have the correct `Content-Type` header.
- Use `Authorization` headers for routes that require authentication.

For any further questions, please contact the API development team.

hritikdubey.direct\@gmail.com

