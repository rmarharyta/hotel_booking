using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCrossOrigins();
            //builder.Services.AddMemoryCache();
            builder.Services.RegisterSecretKeys(builder.Configuration);
            builder.Services.RegisterServices();
            builder.Services.AddJwtAuthentication(builder.Configuration);
            builder.Services.AddAuthorization();

            // Add services to the container.
            builder.Services.AddControllers();

            //connect to MySQL 
            builder.Services.AddDbContext<ApplicationDbContext>();
                //(options => options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")
                //?? throw new InvalidOperationException("No connection string")));

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("_myPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHttpsRedirection();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
