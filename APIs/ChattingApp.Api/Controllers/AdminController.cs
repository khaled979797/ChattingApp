using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChattingApp.Api.Controllers
{
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet(Router.AdminRouting.UsersWithRoles)]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await userManager.Users
                .Include(x => x.UserRoles).ThenInclude(x => x.Role).OrderBy(x => x.UserName)
                .Select(x => new
                {
                    x.Id,
                    Username = x.UserName,
                    Roles = x.UserRoles.Select(x => x.Role.Name).ToList()

                }).ToListAsync();
            return Ok(users);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet(Router.AdminRouting.PhotosToModerate)]
        public ActionResult GetPhotosToModeration()
        {
            return Ok("Admins or moderator can see this");
        }


        [HttpPost(Router.AdminRouting.EditRoles)]
        public async Task<ActionResult> EditRoles([FromRoute] string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await userManager.FindByNameAsync(username);
            if (user == null) return NotFound("Could not find user");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await userManager.GetRolesAsync(user));
        }
    }
}
