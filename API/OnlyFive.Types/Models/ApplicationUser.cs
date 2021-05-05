using Microsoft.AspNetCore.Identity;
using OnlyFive.Types.ModelsInterface;
using System;
using System.Collections.Generic;

namespace OnlyFive.Types.Models
{
    public class ApplicationUser : IdentityUser, IAuditableEntity
    {
        public string FullName { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsLockedOut => this.LockoutEnabled && this.LockoutEnd >= DateTimeOffset.UtcNow;

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        /// <summary>
        /// Navigation property for the roles this user belongs to.
        /// </summary>
        public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

        /// <summary>
        /// Navigation property for the claims this user possesses.
        /// </summary>
        public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

        public virtual ICollection<Game> HostGames { get; set; }
        public virtual ICollection<Game> GuestGames { get; set; }
    }
}
