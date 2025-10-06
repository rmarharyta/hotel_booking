CREATE DATABASE IF NOT EXISTS hotel_booking;
USE hotel_booking;

CREATE TABLE Roles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    Id VARCHAR(256) PRIMARY KEY,
    Email VARCHAR(256) NOT NULL UNIQUE,
    PasswordHash VARCHAR(256) NOT NULL,
    RoleId INT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

CREATE TABLE Hotels (
    Id VARCHAR(256) PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Description TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rooms (
    Id VARCHAR(256) PRIMARY KEY,
    HotelId VARCHAR(256) NOT NULL,
    RoomNumber VARCHAR(20) NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity > 0),
    PricePerNight DECIMAL(10,2) NOT NULL CHECK (PricePerNight >= 0),
    FOREIGN KEY (HotelId) REFERENCES Hotels(Id) ON DELETE CASCADE
);

CREATE TABLE Bookings (
    Id VARCHAR(256) PRIMARY KEY,
    UserId VARCHAR(256) NULL,
    RoomId VARCHAR(256) NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoomId) REFERENCES Rooms(Id) ON DELETE CASCADE
);

-- Індекси для пошуку
CREATE INDEX idx_hotels_city ON Hotels(City);
CREATE INDEX idx_rooms_hotel ON Rooms(HotelId);
CREATE INDEX idx_bookings_user ON Bookings(UserId);
CREATE INDEX idx_bookings_room ON Bookings(RoomId);

-- Початкові дані
INSERT INTO Roles (Name) VALUES ('Admin'), ('Client');

INSERT INTO Users (Id, Email, PasswordHash, RoleId)
VALUES
('11111111-aaaa-1111-aaaa-111111111111', 'admin@example.com', 'hashed_admin_password', 1),
('22222222-bbbb-2222-bbbb-222222222222', 'user@example.com', 'hashed_user_password', 2);

INSERT INTO Hotels (Id, Name, City, Address, Description)
VALUES
('h1-aaaa-bbbb-cccc-000000000001', 'Hotel Riviera', 'Kyiv', 'Khreshchatyk 10', 'Сучасний готель у центрі Києва з видом на Дніпро.'),
('h2-aaaa-bbbb-cccc-000000000002', 'Sea Breeze', 'Odesa', 'Deribasivska 25', 'Готель біля моря з відкритим басейном.'),
('h3-aaaa-bbbb-cccc-000000000003', 'Mountain View', 'Lviv', 'Shevchenka 12', 'Комфортний готель із видом на гори.');

INSERT INTO Rooms (Id, HotelId, RoomNumber, Capacity, PricePerNight, IsAvailable)
VALUES
('r1-aaaa-bbbb-cccc-000000000001', 'h1-aaaa-bbbb-cccc-000000000001', '101', 2, 1500.00, TRUE),
('r2-aaaa-bbbb-cccc-000000000002', 'h1-aaaa-bbbb-cccc-000000000001', '102', 3, 2000.00, TRUE),
('r3-aaaa-bbbb-cccc-000000000003', 'h2-aaaa-bbbb-cccc-000000000002', '201', 2, 1800.00, TRUE),
('r4-aaaa-bbbb-cccc-000000000004', 'h3-aaaa-bbbb-cccc-000000000003', '301', 4, 2500.00, TRUE);

INSERT INTO Bookings (Id, UserId, RoomId, CheckInDate, CheckOutDate, TotalPrice)
VALUES
('b1-aaaa-bbbb-cccc-000000000001', '22222222-bbbb-2222-bbbb-222222222222', 'r1-aaaa-bbbb-cccc-000000000001', '2025-10-10', '2025-10-12', 3000.00),
('b2-aaaa-bbbb-cccc-000000000002', '22222222-bbbb-2222-bbbb-222222222222', 'r3-aaaa-bbbb-cccc-000000000003', '2025-11-01', '2025-11-05', 7200.00);