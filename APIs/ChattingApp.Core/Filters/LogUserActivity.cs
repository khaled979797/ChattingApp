using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.Helpers.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace ChattingApp.Core.Filters
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();
            var userRepository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();

            var user = await userRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.Now;
            await userRepository.SaveAllAsync();
        }
    }
}
