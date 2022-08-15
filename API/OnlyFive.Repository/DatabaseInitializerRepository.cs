using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Helpers;
using OnlyFive.Types.Models;
using System;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class DatabaseInitializerRepository : IDatabaseInitializerRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManagerRepository _accountManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _config;

        public DatabaseInitializerRepository(ApplicationDbContext context, IAccountManagerRepository accountManager, ILogger<DatabaseInitializerRepository> logger, IConfiguration config)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
            _config = config;
        }

        public async Task SeedAsync()
        {
                _logger.LogInformation(_config.GetSection("ConnectionStrings:DefaultConnection").ToString());
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            var u = await _context.Users.FirstOrDefaultAsync(x => true);

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts");

                await EnsureRoleAsync(Constants.ROLE_ADMIN, "Default administrator", new string[] { });
                await EnsureRoleAsync(Constants.ROLE_USER, "Default user", new string[] { });

                await CreateUserAsync("admin", "tempP@ss123", "Inbuilt Administrator", "soncler05@gmail.com", "+52 (465) 121-1341", new string[] { Constants.ROLE_ADMIN }, "b054d785-6997-49d5-a339-573de64e0901");
                await CreateUserAsync(Constants.DEFAULT_USER.UserName, "tempP@ss123", "Inbuilt Standard User", Constants.DEFAULT_USER.Email, "+1 (123) 000-0001", new string[] { Constants.ROLE_USER }, Constants.DEFAULT_USER.Id);
                await CreateUserAsync(Constants.AUTOMATIC_USER.UserName, "tempP@ss123", "Inbuilt Standard User", Constants.AUTOMATIC_USER.Email, "+1 (123) 000-0001", new string[] { Constants.ROLE_USER }, Constants.AUTOMATIC_USER.Id);

                _logger.LogInformation("Inbuilt account generation completed");
            }

        }



        private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                ApplicationRole applicationRole = new ApplicationRole(roleName);

                var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

                if (!result.Succeeded)
                    throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles, string id)
        {
            ApplicationUser applicationUser = new ApplicationUser
            {
                Id = id,
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
            };

            var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

            if (!result.Succeeded)
                throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");


            return applicationUser;
        }
    }
}
