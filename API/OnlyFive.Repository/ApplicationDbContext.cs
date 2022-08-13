using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OnlyFive.Types.Models;
using OnlyFive.Types.ModelsInterface;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OnlyFive.Repository
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public string CurrentUserId { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Round> Rounds { get; set; }


        public ApplicationDbContext(DbContextOptions options) : base(options)
        { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            const string priceDecimalType = "decimal(18,2)";

            builder.Entity<ApplicationUser>().HasMany(u => u.Claims).WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser>().HasMany(u => u.Roles).WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>().HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole>().HasMany(r => r.Users).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Game>().HasKey(g => g.Id);
            builder.Entity<Game>().HasOne(g => g.Host).WithMany(u => u.HostGames).HasForeignKey(x => x.HostId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Game>().HasOne(g => g.Guest).WithMany(u => u.GuestGames).HasForeignKey(x => x.GuestId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Game>().Property(g => g.HostDevice).HasMaxLength(50);
            builder.Entity<Game>().Property(g => g.GuestDevice).HasMaxLength(50);

            builder.Entity<Round>().HasOne(g => g.Game).WithMany(u => u.Rounds).HasForeignKey(x => x.GameId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Round>().HasKey(g => new { g.GameId, g.Offset });


            //builder.Entity<Customer>().Property(c => c.Name).IsRequired().HasMaxLength(100);
            //builder.Entity<Customer>().HasIndex(c => c.Name);
            //builder.Entity<Customer>().Property(c => c.Email).HasMaxLength(100);
            //builder.Entity<Customer>().Property(c => c.PhoneNumber).IsUnicode(false).HasMaxLength(30);
            //builder.Entity<Customer>().Property(c => c.City).HasMaxLength(50);
            //builder.Entity<Customer>().ToTable($"App{nameof(this.Customers)}");

            //builder.Entity<ProductCategory>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            //builder.Entity<ProductCategory>().Property(p => p.Description).HasMaxLength(500);
            //builder.Entity<ProductCategory>().ToTable($"App{nameof(this.ProductCategories)}");

            //builder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            //builder.Entity<Product>().HasIndex(p => p.Name);
            //builder.Entity<Product>().Property(p => p.Description).HasMaxLength(500);
            //builder.Entity<Product>().Property(p => p.Icon).IsUnicode(false).HasMaxLength(256);
            //builder.Entity<Product>().HasOne(p => p.Parent).WithMany(p => p.Children).OnDelete(DeleteBehavior.Restrict);
            //builder.Entity<Product>().ToTable($"App{nameof(this.Products)}");
            //builder.Entity<Product>().Property(p => p.BuyingPrice).HasColumnType(priceDecimalType);
            //builder.Entity<Product>().Property(p => p.SellingPrice).HasColumnType(priceDecimalType);

            //builder.Entity<Order>().Property(o => o.Comments).HasMaxLength(500);
            //builder.Entity<Order>().ToTable($"App{nameof(this.Orders)}");
            //builder.Entity<Order>().Property(p => p.Discount).HasColumnType(priceDecimalType);

            //builder.Entity<OrderDetail>().ToTable($"App{nameof(this.OrderDetails)}");
            //builder.Entity<OrderDetail>().Property(p => p.UnitPrice).HasColumnType(priceDecimalType);
            //builder.Entity<OrderDetail>().Property(p => p.Discount).HasColumnType(priceDecimalType);
        }




        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }


        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }


        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }


        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}
