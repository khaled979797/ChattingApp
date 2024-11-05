using ChattingApp.Core.Context;
using ChattingApp.Core.Filters;
using ChattingApp.Core.Interfaces;
using ChattingApp.Core.Repositories;
using ChattingApp.Core.SignalR;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ChattingApp.Core
{
    public static class CoreModuleServices
    {
        public static IServiceCollection AddCoreModuleServices(this IServiceCollection services, IConfiguration config)
        {
            #region Context
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("dbContext"));
            });
            #endregion

            #region Cors
            services.AddCors();
            #endregion

            #region Dependencies
            services.AddScoped<ITokenRepository, TokenRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<ILikeRepository, LikeRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddSingleton<PresenceTracker>();

            #endregion

            #region JWT/SignalR
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/Hubs"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            services.AddSignalR();
            #endregion

            #region Cloudinary
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            #endregion

            #region Identity
            services.AddIdentityCore<AppUser>().AddSignInManager<SignInManager<AppUser>>()
                .AddRoles<AppRole>().AddRoleManager<RoleManager<AppRole>>()
                .AddRoleValidator<RoleValidator<AppRole>>().AddEntityFrameworkStores<AppDbContext>();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
            });
            #endregion

            return services;
        }
    }
}
