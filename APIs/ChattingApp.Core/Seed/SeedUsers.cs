using ChattingApp.Core.Context;
using ChattingApp.Entities.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ChattingApp.Core.Seed
{
    public static class SeedUsers
    {
        public static async Task SeedUsersData(AppDbContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync(@"D:\Programming\Projects\ChattingApp\APIs\ChattingApp.Core\Seed\UserData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Khaled@1234"));
                user.PasswordSalt = hmac.Key;
                await context.Users.AddAsync(user);
            }
            await context.SaveChangesAsync();
        }
    }
}
