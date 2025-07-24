CREATE TABLE CareTypes (
    CareTypeID INT PRIMARY KEY IDENTITY,  -- מזהה טיפול ייחודי
    CareTypeName VARCHAR(100),            -- שם הטיפול
    TimeOfCare INT,                          -- משך הטיפול (בדקות)
    MinPrice DECIMAL(10, 2)                   -- מחיר הטיפול
);


