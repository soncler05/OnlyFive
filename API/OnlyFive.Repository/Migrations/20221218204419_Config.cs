using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyFive.Repository.Migrations
{
    public partial class Config : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Config",
                table: "Games");

            migrationBuilder.CreateTable(
                name: "Configs",
                columns: table => new
                {
                    GameId = table.Column<int>(type: "int", nullable: false),
                    HostName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuestName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configs", x => x.GameId);
                    table.ForeignKey(
                        name: "FK_Configs_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Configs");

            migrationBuilder.AddColumn<string>(
                name: "Config",
                table: "Games",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
