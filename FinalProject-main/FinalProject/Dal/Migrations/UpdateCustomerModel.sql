-- עדכון טבלת Customers
ALTER TABLE Customers 
DROP COLUMN FullName

ALTER TABLE Customers 
ADD FullName NVARCHAR(255) NOT NULL DEFAULT '';

-- שינוי CustomerId למפתח רץ
ALTER TABLE Customers 
DROP CONSTRAINT PK_Customers;

ALTER TABLE Customers 
DROP COLUMN CustomerId;

ALTER TABLE Customers 
ADD CustomerId INT IDENTITY(1,1) PRIMARY KEY;