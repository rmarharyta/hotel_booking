using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Backend.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> context, IConfiguration configuration) : DbContext
    {
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseMySQL(configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("No connection string"));
        }

    }
}
