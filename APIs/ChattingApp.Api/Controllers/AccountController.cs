using AutoMapper;
using ChattingApp.Core.Filters;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChattingApp.Api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ITokenRepository tokenRepository;
        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;

        public AccountController(ITokenRepository tokenRepository, IMapper mapper,
            UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            this.tokenRepository = tokenRepository;
            this.mapper = mapper;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [HttpPost(Router.AccountRouting.Register)]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await userManager.Users.AnyAsync(x => x.UserName == registerDto.Username.ToLower()))
            {
                return BadRequest("Username is taken");
            }

            var user = mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await userManager.AddToRoleAsync(user, "Member");
            if (!result.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenRepository.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost(Router.AccountRouting.Login)]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.Users.Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized();

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenRepository.CreateToken(user),
                PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
    }
}
