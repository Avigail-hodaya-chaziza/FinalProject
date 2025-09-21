using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dal.Migrations
{
    /// <inheritdoc />
    public partial class FixHebrewEncoding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // תיקון encoding לעברית בטבלת Treatments
            migrationBuilder.Sql(@"
                ALTER TABLE Treatments 
                ALTER COLUMN TreatmentName NVARCHAR(255) COLLATE Hebrew_CI_AS;
                
                ALTER TABLE Treatments 
                ALTER COLUMN Description NVARCHAR(MAX) COLLATE Hebrew_CI_AS;
            ");
            
            // תיקון encoding לעברית בטבלת Customers
            migrationBuilder.Sql(@"
                ALTER TABLE Customers 
                ALTER COLUMN FirstName NVARCHAR(255) COLLATE Hebrew_CI_AS;
                
                ALTER TABLE Customers 
                ALTER COLUMN LastName NVARCHAR(255) COLLATE Hebrew_CI_AS;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // החזרת הגדרות ברירת מחדל
            migrationBuilder.Sql(@"
                ALTER TABLE Treatments 
                ALTER COLUMN TreatmentName NVARCHAR(255);
                
                ALTER TABLE Treatments 
                ALTER COLUMN Description NVARCHAR(MAX);
                
                ALTER TABLE Customers 
                ALTER COLUMN FirstName NVARCHAR(255);
                
                ALTER TABLE Customers 
                ALTER COLUMN LastName NVARCHAR(255);
            ");
        }
    }
}
