using ChattingApp.Core.Context;
using ChattingApp.Core.Interfaces;
using ChattingApp.Core.Repositories;
using ChattingApp.Entities.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
            #endregion

            #region JWT
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            #endregion

            #region Cloudinary
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            #endregion

            return services;
        }
    }
}
