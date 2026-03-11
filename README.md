# SmartPark Car Washing Sales Management System (CWSMS)

This project implements the SmartPark Car Washing Sales Management System for Rubavu District, Rwanda. It replaces the paper-based workflow with a web-based system that captures car details, manages service packages, records payments, and generates reports.

## Scenario Summary
SmartPark provides car-related services and needs to manage car washing sales efficiently. The system supports:
- Car registration (plate, type, size, driver info)
- Package management (name, description, price)
- Service records (car + package + date)
- Payments (amount, date, linked to service record)
- Daily reports and bill generation
- Session-based login for receptionists

<video src="./smart-park.mp4" controls width="800"></video>

[▶ Watch SmartPark Demo](./smart-park.mp4)
## Project Structure
- `C:\Users\K  BRIAN\Documents\Playground\backend-project`
  - Node.js + Express backend
  - MySQL database integration
  - Session-based authentication
- `C:\Users\K  BRIAN\Documents\Playground\frontend-project`
  - React + Tailwind CSS frontend
  - Axios for API calls
  - Responsive UI with required pages

## ERD (Logical Design)
Entities and key relationships:
- Car (PlateNumber PK)
- Package (PackageNumber PK)
- ServicePackage (RecordNumber PK, FK PlateNumber, FK PackageNumber)
- Payment (PaymentNumber PK, FK RecordNumber)

Cardinalities:
- Car 1 -> * ServicePackage
- Package 1 -> * ServicePackage
- ServicePackage 1 -> 0..1 Payment

## Database Setup (MySQL)
1. Create the database and tables by running:
   - `C:\Users\K  BRIAN\Documents\Playground\backend-project\db\schema.sql`
2. The schema includes seed data for the three required packages:
   - Basic wash (5000 RWF)
   - Classic wash (10,000 RWF)
   - Premium wash (20,000 RWF)

## Backend Setup
1. Go to backend folder:
   - `C:\Users\K  BRIAN\Documents\Playground\backend-project`
2. Install dependencies:
   - `npm.cmd install`
3. Create `.env` file from `.env.example`:
   - `C:\Users\K  BRIAN\Documents\Playground\backend-project\.env`

Example `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=CWSMS
SESSION_SECRET=cwsms-secret
PORT=5000
```
4. Create a login user (example):
   - `node scripts/create-user.js admin admin123`
5. Start backend server:
   - `npm.cmd run dev`

Backend runs on `http://localhost:5000`.

## Frontend Setup
1. Go to frontend folder:
   - `C:\Users\K  BRIAN\Documents\Playground\frontend-project`
2. Install dependencies:
   - `npm.cmd install`
3. Start frontend:
   - `npm.cmd run dev`

Frontend runs on `http://localhost:5173`.

## Features Implemented
- Car Registration (Insert + List)
- Package Management (Insert + List)
- Service Package (Insert, Update, Delete, Retrieve)
- Payment Recording (Insert + List)
- Daily Report: PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate
- Bill Generation per Service Record
- Session-based login
- Responsive UI using Tailwind CSS

## API Endpoints
Auth:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Car:
- `POST /api/cars`
- `GET /api/cars`

Package:
- `POST /api/packages`
- `GET /api/packages`

ServicePackage (full CRUD):
- `POST /api/service-packages`
- `GET /api/service-packages`
- `PUT /api/service-packages/:recordNumber`
- `DELETE /api/service-packages/:recordNumber`

Payment:
- `POST /api/payments`
- `GET /api/payments`

Reports:
- `GET /api/reports/daily?date=YYYY-MM-DD`
- `GET /api/reports/bill/:recordNumber`

## Notes and Constraints from Scenario
- Insert operation is required for all four forms: Car, Package, ServiceRecord (ServicePackage), Payment.
- Update, Delete, Retrieve operations are only required for ServiceRecord (ServicePackage).
- Session-based login is required.
- Application should be responsive.
- Backend folders must be `backend-project` and frontend folders must be `frontend-project`.

## Optional Enhancements (Not Required)
- Invoice print/export (PDF)
- CSV export for daily reports
- Validation and input masking
- Role-based access

## Cleanup
When the assessment is complete, remove the project only after asking permission from the assessor.




