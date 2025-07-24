CREATE TABLE [dbo].BlockedSlots
(
    Id INT PRIMARY KEY IDENTITY(1,1),
    Date DATE NOT NULL,
    HolidayName NVARCHAR(100),
    CountryCode CHAR(2) NOT NULL,  -- קוד המדינה, לדוגמה IL לישראל
    Year INT NOT NULL,
    IsHoliday BIT NOT NULL  -- 1 עבור חג, 0 עבור יום מיוחד שלא חג
);