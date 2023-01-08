using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyFive.Repository.Migrations
{
    public partial class temporarygameConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Config",
                table: "Games",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Config",
                table: "Games");
        }
    }
}
