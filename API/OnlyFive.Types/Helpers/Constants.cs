using OnlyFive.Types.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlyFive.Types.Helpers
{
    public static class Constants
    {
        public const string ROLE_ADMIN = "administrator";
        public const string ROLE_USER = "user";
        public static ApplicationUser DEFAULT_USER => new ApplicationUser
        {
            Id= "9a1bc0bc-8a63-4b8d-b094-56353d2a8031",
            UserName = "defaultUser",
            Email = "defaultUser@onlyfive.com",
        };
        public static ApplicationUser AUTOMATIC_USER => new ApplicationUser
        {
            Id= "40b2ad9d-64e2-4b41-9706-8b4e29fe6851",
            UserName = "smartNia",
            Email = "smartNia@onlyfive.com",
        };
    }
    //await CreateUserAsync("user", "tempP@ss123", "Inbuilt Standard User", "user@ebenmonney.com", "+1 (123) 000-0001", new string[] { Constants.ROLE_USER });
}
