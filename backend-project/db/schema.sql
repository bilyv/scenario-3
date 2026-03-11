CREATE DATABASE IF NOT EXISTS CWSMS;
USE CWSMS;

CREATE TABLE IF NOT EXISTS car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  CarType VARCHAR(50) NOT NULL,
  CarSize VARCHAR(50) NOT NULL,
  DriverName VARCHAR(100) NOT NULL,
  PhoneNumber VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS package (
  PackageNumber INT PRIMARY KEY,
  PackageName VARCHAR(100) NOT NULL,
  PackageDescription VARCHAR(255) NOT NULL,
  PackagePrice DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS servicepackage (
  RecordNumber INT PRIMARY KEY,
  ServiceDate DATE NOT NULL,
  PlateNumber VARCHAR(20) NOT NULL,
  PackageNumber INT NOT NULL,
  CONSTRAINT fk_service_car FOREIGN KEY (PlateNumber) REFERENCES car(PlateNumber),
  CONSTRAINT fk_service_package FOREIGN KEY (PackageNumber) REFERENCES package(PackageNumber)
);

CREATE TABLE IF NOT EXISTS payment (
  PaymentNumber INT PRIMARY KEY,
  AmountPaid DECIMAL(10,2) NOT NULL,
  PaymentDate DATE NOT NULL,
  RecordNumber INT NOT NULL,
  CONSTRAINT fk_payment_record FOREIGN KEY (RecordNumber) REFERENCES servicepackage(RecordNumber)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO package (PackageNumber, PackageName, PackageDescription, PackagePrice) VALUES
  (1, 'Basic wash', 'Exterior hand wash', 5000.00),
  (2, 'Classic wash', 'Interior hand wash', 10000.00),
  (3, 'Premium wash', 'Exterior and Interior hand wash', 20000.00)
ON DUPLICATE KEY UPDATE
  PackageName = VALUES(PackageName),
  PackageDescription = VALUES(PackageDescription),
  PackagePrice = VALUES(PackagePrice);
