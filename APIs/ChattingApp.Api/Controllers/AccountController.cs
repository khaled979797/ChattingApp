using AutoMapper;
using ChattingApp.Core.Context;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ChattingApp.Api.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly ITokenRepository tokenRepository;
        private readonly IMapper mapper;

        public AccountController(AppDbContext context, ITokenRepository tokenRepository, IMapper mapper)
        {
            this.context = context;
            this.tokenRepository = tokenRepository;
            this.mapper = mapper;
        }

        [HttpPost(Router.AccountRouting.Register)]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await context.Users.AnyAsync(x => x.UserName == registerDto.Username.ToLower()))
            {
                return BadRequest("Username is taken");
            }

            using var hmac = new HMACSHA512();

            var user = mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return new UserDto
            {
                Username = user.UserName,
                Token = tokenRepository.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost(Router.AccountRouting.Login)]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await context.Users.Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Invalid Username");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }
            return new UserDto
            {
                Username = user.UserName,
                Token = tokenRepository.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
    }
}
