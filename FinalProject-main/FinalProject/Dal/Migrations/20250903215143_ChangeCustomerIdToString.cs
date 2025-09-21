using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dal.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCustomerIdToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint first
            migrationBuilder.DropForeignKey(
                name: "FK__Appointme__Custo__634EBE90",
                table: "Appointments");

            // Drop the primary key on the CustomerID column
            migrationBuilder.DropPrimaryKey(
                name: "PK__tmp_ms_x__A4AE64B8401790B3",
                table: "Customers");

            // Change the column type from int to string in the Customers table
            migrationBuilder.AlterColumn<string>(
                name: "CustomerID",
                table: "Customers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            // Change the column type from int to string in the Appointments table
            migrationBuilder.AlterColumn<string>(
                name: "CustomerID",
                table: "Appointments",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            // Add the primary key back
            migrationBuilder.AddPrimaryKey(
                name: "PK__tmp_ms_x__A4AE64B8401790B3",
                table: "Customers",
                column: "CustomerID");

            // Add the foreign key back
            migrationBuilder.AddForeignKey(
                name: "FK__Appointme__Custo__634EBE90",
                table: "Appointments",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint first
            migrationBuilder.DropForeignKey(
                name: "FK__Appointme__Custo__634EBE90",
                table: "Appointments");

            // Drop the primary key on the CustomerID column
            migrationBuilder.DropPrimaryKey(
                name: "PK__tmp_ms_x__A4AE64B8401790B3",
                table: "Customers");

            // Change the column type from string to int in the Customers table
            migrationBuilder.AlterColumn<int>(
                name: "CustomerID",
                table: "Customers",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)")
                .Annotation("SqlServer:Identity", "1, 1")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            // Change the column type from string to int in the Appointments table
            migrationBuilder.AlterColumn<int>(
                name: "CustomerID",
                table: "Appointments",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            // Add the primary key back
            migrationBuilder.AddPrimaryKey(
                name: "PK__tmp_ms_x__A4AE64B8401790B3",
                table: "Customers",
                column: "CustomerID");

            // Add the foreign key back
            migrationBuilder.AddForeignKey(
                name: "FK__Appointme__Custo__634EBE90",
                table: "Appointments",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}