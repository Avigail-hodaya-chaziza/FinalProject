using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dal.Migrations
{
    /// <inheritdoc />
    public partial class MigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AvailableWorkingHours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsAvailable = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Availabl__3214EC07B2CC71FF", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CareTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nchar(10)", fixedLength: true, maxLength: 10, nullable: true),
                    MinPrice = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CareType__3214EC077D183B27", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nchar(10)", fixedLength: true, maxLength: 10, nullable: false),
                    phone = table.Column<string>(type: "nchar(10)", fixedLength: true, maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "nchar(10)", fixedLength: true, maxLength: 10, nullable: false),
                    IdCareTypes = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tmp_ms_x__3214EC07F9C92C00", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Client_ToCareTypes",
                        column: x => x.IdCareTypes,
                        principalTable: "CareTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    IdClient = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Clients__3214EC07BB027F8B", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customers_ToClient",
                        column: x => x.IdClient,
                        principalTable: "Client",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    IdClients = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    IdCareTypes = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tmp_ms_x__3214EC078D4A93E9", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointment_ToCareTypes",
                        column: x => x.IdCareTypes,
                        principalTable: "CareTypes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointment_ToClients",
                        column: x => x.IdClients,
                        principalTable: "Clients",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Slots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    IdAppointment = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Slots__3214EC073AC14F02", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Slots_ToAppointment",
                        column: x => x.IdAppointment,
                        principalTable: "Appointment",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_IdCareTypes",
                table: "Appointment",
                column: "IdCareTypes");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_IdClients",
                table: "Appointment",
                column: "IdClients");

            migrationBuilder.CreateIndex(
                name: "IX_Client_IdCareTypes",
                table: "Client",
                column: "IdCareTypes");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_IdClient",
                table: "Clients",
                column: "IdClient");

            migrationBuilder.CreateIndex(
                name: "IX_Slots_IdAppointment",
                table: "Slots",
                column: "IdAppointment");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailableWorkingHours");

            migrationBuilder.DropTable(
                name: "Slots");

            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Client");

            migrationBuilder.DropTable(
                name: "CareTypes");
        }
    }
}
