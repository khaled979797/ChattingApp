using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ChattingApp.Core.Seed
{
    public static class SeedUsers
    {
        public static async Task SeedUsersData(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync(@"D:\Programming\Projects\ChattingApp\APIs\ChattingApp.Core\Seed\UserData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{ Name = "Member"},
                new AppRole{ Name = "Admin"},
                new AppRole{ Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Khaled@1234");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser { UserName = "admin" };
            await userManager.CreateAsync(admin, "Khaled@1234");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}
