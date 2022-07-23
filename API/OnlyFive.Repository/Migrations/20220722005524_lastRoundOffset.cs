using Microsoft.EntityFrameworkCore.Migrations;

namespace OnlyFive.Repository.Migrations
{
    public partial class lastRoundOffset : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastRoundOffset",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastRoundOffset",
                table: "Games");
        }
    }
}
