using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AuthenticationService = Backend.Services.AuthenticationService;
using IAuthenticationService = Backend.Services.IAuthenticationService;

namespace Backend
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection RegisterSecretKeys(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions<SecretKeys>().Bind(configuration.GetSection(SecretKeys.Position));

            return services;
        }
        public static IServiceCollection AddCrossOrigins(this IServiceCollection services)
        {
            const string MyPolicy = "_myPolicy";
            //CORS - Cross-Origin Resource Sharing
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyPolicy,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:5205")
                                            .AllowAnyHeader()
                                            .AllowCredentials()
                                            .AllowAnyMethod();
                                  });
            });
            return services;
        }
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddSingleton<IEncryptionService, EncryptionService>();
            services.AddScoped<IUserClaimsMapper<User>, UserClaimsMapper>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped <IUserService, UserServices>();
            services.AddScoped<IHotelService, HotelServices>();
            services.AddScoped<IRoomService, RoomServices>();
            services.AddScoped<IBookingService, BookingServices>();
            services.AddScoped<IBookingStatisticsService, BookingStatisticsService>();

            return services;
        }

        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = configuration["JwtConfig:Issuer"],
                            ValidAudience = configuration["JwtConfig:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtConfig:Key"] ?? throw new InvalidOperationException("No JWT Key"))),
                        };

                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                if (context.Request.Cookies.ContainsKey(CookieKeys.Token))
                                {
                                    context.Token = context.Request.Cookies[CookieKeys.Token];
                                }

                                return Task.CompletedTask;
                            }
                        };
                    });

            return services;
        }
    }
}