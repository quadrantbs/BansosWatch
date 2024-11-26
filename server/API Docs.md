# Bansos Watch - API Documentation

## Base URL
`https://bansoswatch.okattako.site/`

## Authentication
Authentication is required for certain endpoints using JWT. You can get the token by logging in with the `POST /auth/login` endpoint.

---

## Endpoints

### 1. **POST /auth/register**
**Description**: Register a new user.

#### Request Body:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "_id": "user_id",
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-11-20T12:34:56Z"
  }
}
```

#### Response (Error):
- **400 Bad Request**: Validation errors, missing fields.

---

### 2. **POST /auth/login**
**Description**: Login an existing user.

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "JWT_TOKEN_HERE"
  }
}
```

#### Response (Error):
- **400 Bad Request**: Validation errors, incorrect credentials.
- **401 Unauthorized**: Invalid token.

---

### 3. **GET /users/{id}**
**Description**: Get user details by ID.

#### Path Parameters:
- `id`: The ID of the user.

#### Response (Success):
```json
{
  "success": true,
  "message": "User successfully retrieved.",
  "data": {
    "_id": "user_id",
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-11-20T12:34:56Z"
  }
}
```

#### Response (Error):
- **404 Not Found**: User not found.

---

### 4. **POST /reports**
**Description**: Create a new report.

#### Request Body:
```json
{
  "program_name": "Food Distribution",
  "recipients_count": 150,
  "region": {
    "province": "Province A",
    "city_or_district": "District B",
    "subdistrict": "Subdistrict C"
  },
  "distribution_date": "2024-11-20T10:00:00Z",
  "proof_of_distribution": {
    "file": "URL_TO_FILE"
  },
  "additional_notes": "No additional notes"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "Report added successfully",
  "data": {
    "program_name": "Food Distribution",
    "recipients_count": 150,
    "region": {
      "province": "Province A",
      "city_or_district": "District B",
      "subdistrict": "Subdistrict C"
    },
    "distribution_date": "2024-11-20T10:00:00Z",
    "proof_of_distribution": {
      "file": "URL_TO_FILE"
    },
    "additional_notes": "No additional notes",
    "status": "pending",
    "createdAt": "2024-11-20T12:34:56Z",
    "updatedAt": "2024-11-20T12:34:56Z"
  }
}
```

#### Response (Error):
- **400 Bad Request**: Validation errors, missing fields.

---

### 5. **GET /reports**
**Description**: Retrieve all reports with pagination.

#### Query Parameters:
- `page`: Page number (default is 1).
- `limit`: Number of reports per page (default is 10).

#### Response (Success):
```json
{
  "success": true,
  "message": "All reports successfully retrieved",
  "data": [
    {
      "_id": "report_id",
      "program_name": "Food Distribution",
      "recipients_count": 150,
      "region": {
        "province": "Province A",
        "city_or_district": "District B",
        "subdistrict": "Subdistrict C"
      },
      "distribution_date": "2024-11-20T10:00:00Z",
      "proof_of_distribution": {
        "file": "URL_TO_FILE"
      },
      "status": "pending"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalDocuments": 50
  }
}
```

#### Response (Error):
- **500 Internal Server Error**: Database errors or unexpected failures.

---

### 6. **GET /reports/{id}**
**Description**: Get details of a specific report by ID.

#### Path Parameters:
- `id`: The ID of the report.

#### Response (Success):
```json
{
  "success": true,
  "message": "Report with ID report_id successfully retrieved",
  "data": {
    "_id": "report_id",
    "program_name": "Food Distribution",
    "recipients_count": 150,
    "region": {
      "province": "Province A",
      "city_or_district": "District B",
      "subdistrict": "Subdistrict C"
    },
    "distribution_date": "2024-11-20T10:00:00Z",
    "proof_of_distribution": {
      "file": "URL_TO_FILE"
    },
    "status": "pending"
  }
}
```

#### Response (Error):
- **404 Not Found**: Report not found.

---

### 7. **PUT /reports/{id}**
**Description**: Update a report by ID.

#### Path Parameters:
- `id`: The ID of the report.

#### Request Body:
```json
{
  "program_name": "Food Distribution Updated",
  "recipients_count": 200,
  "region": {
    "province": "Province A",
    "city_or_district": "District B",
    "subdistrict": "Subdistrict C"
  },
  "distribution_date": "2024-11-21T10:00:00Z",
  "proof_of_distribution": {
    "file": "URL_TO_FILE"
  },
  "additional_notes": "Updated notes"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "Report with ID report_id successfully updated",
  "data": {
    "program_name": "Food Distribution Updated",
    "recipients_count": 200,
    "region": {
      "province": "Province A",
      "city_or_district": "District B",
      "subdistrict": "Subdistrict C"
    },
    "distribution_date": "2024-11-21T10:00:00Z",
    "proof_of_distribution": {
      "file": "URL_TO_FILE"
    },
    "additional_notes": "Updated notes",
    "status": "pending",
    "createdAt": "2024-11-20T12:34:56Z",
    "updatedAt": "2024-11-21T12:34:56Z"
  }
}
```

#### Response (Error):
- **404 Not Found**: Report not found.
- **400 Bad Request**: Validation errors.

---

### 8. **POST /reports/{id}/verify**
**Description**: Verify a report.

#### Path Parameters:
- `id`: The ID of the report.

#### Response (Success):
```json
{
  "success": true,
  "message": "Report with ID report_id successfully verified",
  "data": {
    "status": "verified"
  }
}
```

#### Response (Error):
- **404 Not Found**: Report not found.

---

### 9. **POST /reports/{id}/reject**
**Description**: Reject a report.

#### Path Parameters:
- `id`: The ID of the report.

#### Response (Success):
```json
{
  "success": true,
  "message": "Report with ID report_id successfully rejected",
  "data": {
    "status": "rejected"
  }
}
```

#### Response (Error):
- **404 Not Found**: Report not found.

---

### 10. **DELETE /reports/{id}**
**Description**: Delete a report.

#### Path Parameters:
- `id`: The ID of the report.

#### Response (Success):
```json
{
  "success": true,
  "message": "Report with ID report_id successfully deleted"
}
```

#### Response (Error):
- **404 Not Found**: Report not found.
- **403 Forbidden**: Cannot delete an verified report.

---

### 11. **POST /reports/send-email**
**Description**: Send an email.

#### Request Body:
```json
{
  "from": "sender@example.com",
  "to": "recipient@example.com",
  "subject": "Subject of the email",
  "message": "Body of the email"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "Email sent successfully",
  "info

": "Email details or status"
}
```

#### Response (Error):
- **400 Bad Request**: Invalid email format or missing fields.

---

### 12. **GET /reports/stats**
**Description**: Retrieve statistical information about the distribution of aid, including the total number of reports, recipients grouped by program, and distribution details by region (province, city/district, and subdistrict).

#### Response (Success):
```json
{
  "success": true,
  "message": "Report statistics successfully retrieved",
  "data": {
    "totalReports": 123,
    "recipientsByProgram": {
      "Food Distribution": 1500,
      "Medical Aid": 500
    },
    "distributionByRegion": {
      "Province A": {
        "City A": {
          "Subdistrict A": 10,
          "Subdistrict B": 5
        },
        "City B": {
          "Subdistrict C": 8
        }
      },
      "Province B": {
        "City C": {
          "Subdistrict D": 20
        }
      }
    }
  }
}
```

## Error Codes
- **400 Bad Request**: Invalid input data, missing required fields.
- **401 Unauthorized**: Invalid or expired JWT token.
- **403 Forbidden**: Insufficient permissions to perform the action.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Server-side errors.