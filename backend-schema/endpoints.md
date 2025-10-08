# EduFinance API Endpoints Documentation

## Authentication & Authorization

### POST /auth/register/school
**Description**: Register a new school with admin account
**Request Body**:
```json
{
  "school": {
    "name": "Example School",
    "email": "school@example.com",
    "phoneNumber": "+2348012345678",
    "registrationNumber": "SCH001",
    "streetAddress": "123 School Street",
    "city": "Lagos",
    "state": "Lagos State",
    "localGovernment": "Ikeja",
    "postalCode": "100001",
    "currentSession": "2024/2025",
    "currentTerm": "FIRST"
  },
  "admin": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "admin@example.com",
    "phoneNumber": "+2348012345679",
    "password": "StrongPassword123!"
  }
}
```
**Response**: `201 Created`
```json
{
  "success": true,
  "message": "School registered successfully",
  "data": {
    "school": { "id": "sch_123", "name": "Example School", "status": "PENDING_VERIFICATION" },
    "admin": { "id": "usr_123", "email": "admin@example.com", "role": "SCHOOL_ADMIN" },
    "verificationCode": "VER123456"
  }
}
```
**Notes**: Auto-creates school wallet and admin user account

### POST /auth/login/school
**Description**: School admin login
**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "StrongPassword123!"
}
```
**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "usr_123", "email": "admin@example.com", "role": "SCHOOL_ADMIN" },
    "school": { "id": "sch_123", "name": "Example School" },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```
**Notes**: Returns JWT tokens for authentication

### POST /auth/login/parent
**Description**: Parent login (created automatically with student)
**Request Body**:
```json
{
  "email": "parent@example.com",
  "password": "ParentPassword123!"
}
```
**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "usr_124", "email": "parent@example.com", "role": "PARENT" },
    "parent": { "id": "par_123", "relationship": "FATHER" },
    "students": [{ "id": "std_123", "name": "Jane Doe", "class": "Primary 1" }],
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```
**Notes**: Returns parent's linked students

### POST /auth/refresh
**Description**: Refresh access token
**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

### POST /auth/logout
**Description**: Logout user and revoke refresh token
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /auth/forgot-password
**Description**: Request password reset
**Request Body**:
```json
{
  "email": "user@example.com"
}
```
**Response**: `200 OK`
**Notes**: Sends reset link to email

### POST /auth/reset-password
**Description**: Reset password with token
**Request Body**:
```json
{
  "token": "reset_token_123",
  "newPassword": "NewPassword123!"
}
```
**Response**: `200 OK`

## School Management

### GET /schools/profile
**Description**: Get current school profile
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "sch_123",
    "name": "Example School",
    "email": "school@example.com",
    "phoneNumber": "+2348012345678",
    "address": {
      "streetAddress": "123 School Street",
      "city": "Lagos",
      "state": "Lagos State"
    },
    "currentSession": "2024/2025",
    "currentTerm": "FIRST",
    "status": "ACTIVE",
    "brandingConfig": {
      "logoUrl": "https://...",
      "brandingEnabled": true
    }
  }
}
```

### PUT /schools/profile
**Description**: Update school profile
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "name": "Updated School Name",
  "phoneNumber": "+2348012345680",
  "brandingEnabled": true,
  "receiptTemplate": "modern"
}
```
**Response**: `200 OK`

### GET /schools/wallet
**Description**: Get school wallet information
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "wal_123",
    "balance": "125000.00",
    "currency": "NGN",
    "status": "ACTIVE",
    "transactions": [
      {
        "id": "txn_123",
        "type": "CREDIT",
        "amount": "50000.00",
        "description": "Payment from John Doe",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET /schools/wallet/transactions
**Description**: Get wallet transaction history
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `type`: Transaction type filter
- `startDate`: Filter from date
- `endDate`: Filter to date
**Response**: `200 OK`

### POST /schools/classes
**Description**: Create new school class
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "name": "Primary 2",
  "level": "PRIMARY",
  "capacity": 30,
  "session": "2024/2025"
}
```
**Response**: `201 Created`

### GET /schools/classes
**Description**: Get all school classes
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `session`: Filter by session
- `level`: Filter by class level
- `isActive`: Filter by active status
**Response**: `200 OK`

## Student Management

### POST /students
**Description**: Register new student (auto-creates parent)
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "student": {
    "firstName": "Jane",
    "lastName": "Doe",
    "middleName": "Mary",
    "dateOfBirth": "2010-05-15",
    "gender": "FEMALE",
    "email": "jane.doe@email.com",
    "phoneNumber": "+2348012345681",
    "address": "456 Student Lane",
    "city": "Lagos",
    "state": "Lagos State",
    "classId": "cls_123"
  },
  "parent": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phoneNumber": "+2348012345682",
    "relationship": "FATHER",
    "occupation": "Engineer",
    "workAddress": "789 Work Street"
  }
}
```
**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Student and parent registered successfully",
  "data": {
    "student": {
      "id": "std_123",
      "admissionNumber": "ADM2024001",
      "name": "Jane Mary Doe",
      "class": "Primary 1"
    },
    "parent": {
      "id": "par_123",
      "user": { "id": "usr_124", "email": "john.doe@email.com" },
      "wallet": { "id": "wal_124", "balance": "0.00" }
    },
    "loginCredentials": {
      "email": "john.doe@email.com",
      "temporaryPassword": "TempPass123!"
    }
  }
}
```
**Notes**: Auto-generates parent account with wallet

### GET /students
**Description**: Get all students for school
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `classId`: Filter by class
- `status`: Filter by status
- `search`: Search by name or admission number
**Response**: `200 OK`

### GET /students/:studentId
**Description**: Get specific student details
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "std_123",
    "admissionNumber": "ADM2024001",
    "firstName": "Jane",
    "lastName": "Doe",
    "class": {
      "id": "cls_123",
      "name": "Primary 1",
      "level": "PRIMARY"
    },
    "parent": {
      "id": "par_123",
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phoneNumber": "+2348012345682"
    },
    "status": "ACTIVE",
    "enrollmentDate": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /students/:studentId
**Description**: Update student information
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**: Partial student object
**Response**: `200 OK`

### DELETE /students/:studentId
**Description**: Deactivate student (soft delete)
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /students/bulk-import
**Description**: Bulk import students from CSV/Excel
**Headers**: `Authorization: Bearer <access_token>`, `Content-Type: multipart/form-data`
**Request Body**: File upload with student data
**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "totalProcessed": 100,
    "successful": 95,
    "failed": 5,
    "errors": [
      { "row": 10, "error": "Invalid email format" }
    ]
  }
}
```

## Parent Management

### GET /parents/profile
**Description**: Get parent profile (parent endpoint)
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "par_123",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@email.com",
      "phoneNumber": "+2348012345682"
    },
    "relationship": "FATHER",
    "occupation": "Engineer",
    "students": [
      {
        "id": "std_123",
        "name": "Jane Mary Doe",
        "class": "Primary 1",
        "school": "Example School"
      }
    ],
    "wallet": {
      "id": "wal_124",
      "balance": "25000.00",
      "currency": "NGN"
    }
  }
}
```

### PUT /parents/profile
**Description**: Update parent profile
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**: Partial parent object
**Response**: `200 OK`

### GET /parents/students
**Description**: Get parent's children
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### GET /parents/wallet
**Description**: Get parent wallet details
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### GET /parents/invoices
**Description**: Get invoices for parent's children
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `studentId`: Filter by specific student
- `status`: Filter by invoice status
- `session`: Filter by academic session
- `term`: Filter by term
**Response**: `200 OK`

## Wallet & Payments

### POST /wallets/fund
**Description**: Fund wallet (for testing/admin purposes)
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "amount": "50000.00",
  "description": "Wallet funding",
  "reference": "FUND_REF_123"
}
```
**Response**: `201 Created`

### POST /payments/initialize
**Description**: Initialize payment for invoice
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "invoiceId": "inv_123",
  "amount": "45000.00",
  "method": "CARD",
  "gateway": "PAYSTACK"
}
```
**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Payment initialized",
  "data": {
    "paymentId": "pay_123",
    "reference": "PAY_REF_123",
    "authorizationUrl": "https://paystack.com/pay/...",
    "amount": "45000.00"
  }
}
```

### POST /payments/verify
**Description**: Verify payment status
**Request Body**:
```json
{
  "reference": "PAY_REF_123",
  "gateway": "PAYSTACK"
}
```
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_123",
    "status": "COMPLETED",
    "amount": "45000.00",
    "verifiedAt": "2024-01-15T10:30:00Z",
    "receipt": {
      "id": "rec_123",
      "receiptNumber": "EDU-2024/2025-FIRST-1705318200-1234"
    }
  }
}
```

### POST /payments/wallet
**Description**: Pay invoice using wallet balance
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "invoiceId": "inv_123",
  "amount": "45000.00",
  "pin": "1234"
}
```
**Response**: `201 Created`

### GET /payments
**Description**: Get payment history
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `invoiceId`: Filter by invoice
- `status`: Filter by payment status
- `method`: Filter by payment method
- `startDate`: Filter from date
- `endDate`: Filter to date
**Response**: `200 OK`

### GET /payments/:paymentId
**Description**: Get specific payment details
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /payments/:paymentId/refund
**Description**: Process payment refund
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "amount": "45000.00",
  "reason": "Duplicate payment"
}
```
**Response**: `201 Created`

## Invoice Management

### POST /invoices
**Description**: Create new invoice for student
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "studentId": "std_123",
  "paymentStructureId": "ps_123",
  "description": "First Term Fees 2024/2025",
  "dueDate": "2024-02-15",
  "items": [
    {
      "category": "Tuition",
      "description": "Tuition Fee",
      "amount": "30000.00"
    },
    {
      "category": "Development Levy",
      "description": "School Development",
      "amount": "15000.00"
    }
  ],
  "discount": "2000.00",
  "session": "2024/2025",
  "term": "FIRST"
}
```
**Response**: `201 Created`
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "inv_123",
    "invoiceNumber": "INV-2024-001",
    "studentName": "Jane Mary Doe",
    "subtotal": "45000.00",
    "discount": "2000.00",
    "totalAmount": "43000.00",
    "status": "PENDING",
    "dueDate": "2024-02-15"
  }
}
```

### POST /invoices/bulk
**Description**: Create invoices for multiple students
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "studentIds": ["std_123", "std_124", "std_125"],
  "paymentStructureId": "ps_123",
  "description": "First Term Fees 2024/2025",
  "dueDate": "2024-02-15",
  "session": "2024/2025",
  "term": "FIRST"
}
```
**Response**: `201 Created`

### POST /invoices/bulk-by-class
**Description**: Create invoices for entire class
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "classId": "cls_123",
  "paymentStructureId": "ps_123",
  "description": "First Term Fees 2024/2025",
  "dueDate": "2024-02-15"
}
```
**Response**: `201 Created`

### GET /invoices
**Description**: Get all invoices for school
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `studentId`: Filter by student
- `classId`: Filter by class
- `session`: Filter by session
- `term`: Filter by term
- `dueDate`: Filter by due date
**Response**: `200 OK`

### GET /invoices/:invoiceId
**Description**: Get specific invoice details
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "inv_123",
    "invoiceNumber": "INV-2024-001",
    "student": {
      "id": "std_123",
      "name": "Jane Mary Doe",
      "class": "Primary 1",
      "admissionNumber": "ADM2024001"
    },
    "items": [
      {
        "category": "Tuition",
        "description": "Tuition Fee",
        "amount": "30000.00"
      }
    ],
    "subtotal": "45000.00",
    "discount": "2000.00",
    "totalAmount": "43000.00",
    "paidAmount": "20000.00",
    "outstandingAmount": "23000.00",
    "status": "PARTIALLY_PAID",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "payments": [
      {
        "id": "pay_123",
        "amount": "20000.00",
        "method": "CARD",
        "status": "COMPLETED",
        "paidAt": "2024-01-20"
      }
    ]
  }
}
```

### PUT /invoices/:invoiceId
**Description**: Update invoice (only if not paid)
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**: Partial invoice object
**Response**: `200 OK`

### DELETE /invoices/:invoiceId
**Description**: Cancel invoice
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /invoices/:invoiceId/send
**Description**: Send invoice to parent
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /invoices/:invoiceId/reminder
**Description**: Send payment reminder
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "message": "Custom reminder message"
}
```
**Response**: `200 OK`

## Payment Structure Management

### POST /payment-structures
**Description**: Create payment structure template
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "name": "Primary 1 First Term",
  "description": "Standard fees for Primary 1",
  "classId": "cls_123",
  "session": "2024/2025",
  "term": "FIRST",
  "isTemplate": true,
  "structure": {
    "items": [
      {
        "category": "Tuition",
        "amount": "30000.00",
        "description": "Tuition Fee"
      },
      {
        "category": "Development Levy",
        "amount": "15000.00",
        "description": "School Development"
      }
    ]
  }
}
```
**Response**: `201 Created`

### GET /payment-structures
**Description**: Get all payment structures
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `classId`: Filter by class
- `session`: Filter by session
- `term`: Filter by term
- `isTemplate`: Filter templates only
- `isActive`: Filter active structures
**Response**: `200 OK`

### GET /payment-structures/:structureId
**Description**: Get specific payment structure
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### PUT /payment-structures/:structureId
**Description**: Update payment structure
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**: Partial structure object
**Response**: `200 OK`

### DELETE /payment-structures/:structureId
**Description**: Deactivate payment structure
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /payment-structures/:structureId/copy
**Description**: Copy structure to another class/term
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "classId": "cls_124",
  "session": "2024/2025",
  "term": "SECOND",
  "name": "Primary 2 Second Term"
}
```
**Response**: `201 Created`

## Receipt Management

### GET /receipts
**Description**: Get all receipts
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `studentId`: Filter by student
- `paymentId`: Filter by payment
- `startDate`: Filter from date
- `endDate`: Filter to date
**Response**: `200 OK`

### GET /receipts/:receiptId
**Description**: Get specific receipt
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### GET /receipts/:receiptId/download
**Description**: Download receipt PDF
**Headers**: `Authorization: Bearer <access_token>`
**Response**: PDF file

### POST /receipts/:receiptId/resend
**Description**: Resend receipt to parent
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

## Notifications

### GET /notifications
**Description**: Get user notifications
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `isRead`: Filter by read status
- `type`: Filter by notification type
- `priority`: Filter by priority
**Response**: `200 OK`

### PUT /notifications/:notificationId/read
**Description**: Mark notification as read
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### PUT /notifications/mark-all-read
**Description**: Mark all notifications as read
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### POST /notifications/send
**Description**: Send custom notification (admin only)
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "title": "System Maintenance",
  "message": "System will be down for maintenance",
  "type": "SYSTEM_ALERT",
  "priority": "HIGH",
  "recipients": ["par_123", "par_124"]
}
```
**Response**: `201 Created`

## Reports & Analytics

### GET /reports/financial-summary
**Description**: Get financial summary report
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `session`: Academic session
- `term`: Academic term
- `classId`: Specific class
- `startDate`: From date
- `endDate`: To date
**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalInvoiced": "2500000.00",
    "totalCollected": "2100000.00",
    "totalOutstanding": "400000.00",
    "collectionRate": 84.0,
    "paymentMethods": {
      "CARD": "1200000.00",
      "BANK_TRANSFER": "700000.00",
      "WALLET": "200000.00"
    }
  }
}
```

### GET /reports/student-payment-status
**Description**: Get student payment status report
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**: Same as financial summary
**Response**: `200 OK`

### GET /reports/class-performance
**Description**: Get class-wise payment performance
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### GET /reports/export
**Description**: Export reports to CSV/Excel
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `type`: Report type (financial, student-status, etc.)
- `format`: Export format (csv, excel)
- Plus filter parameters
**Response**: File download

## Activity Logs

### GET /activity-logs
**Description**: Get activity logs (admin only)
**Headers**: `Authorization: Bearer <access_token>`
**Query Parameters**:
- `actorType`: Filter by actor type
- `action`: Filter by action
- `startDate`: From date
- `endDate`: To date
**Response**: `200 OK`

## System Configuration

### GET /config/school-settings
**Description**: Get school configuration settings
**Headers**: `Authorization: Bearer <access_token>`
**Response**: `200 OK`

### PUT /config/school-settings
**Description**: Update school settings
**Headers**: `Authorization: Bearer <access_token>`
**Request Body**:
```json
{
  "brandingEnabled": true,
  "receiptTemplate": "modern",
  "receiptColorScheme": "green",
  "showParentInfo": true,
  "autoGenerateReceipts": true,
  "notificationSettings": {
    "emailEnabled": true,
    "smsEnabled": false
  }
}
```
**Response**: `200 OK`

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

## Authentication

All protected endpoints require JWT authentication:
```
Authorization: Bearer <access_token>
```

Tokens expire after 1 hour. Use the refresh token to get new access tokens.

## Rate Limiting

API endpoints are rate limited:
- Public endpoints: 100 requests/hour per IP
- Authenticated endpoints: 1000 requests/hour per user
- Payment endpoints: 50 requests/hour per user

## Pagination

List endpoints support pagination:
```
GET /endpoint?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Webhooks

### POST /webhooks/payment-status
**Description**: Webhook for payment gateway notifications
**Request Body**: Payment gateway specific payload
**Response**: `200 OK`

This endpoint handles notifications from payment gateways (Paystack, Flutterwave, etc.) about payment status changes.