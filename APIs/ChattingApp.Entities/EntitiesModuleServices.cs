using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ChattingApp.Entities
{
    public static class EntitiesModuleServices
    {
        public static IServiceCollection AddEntitiesModuleServices(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
