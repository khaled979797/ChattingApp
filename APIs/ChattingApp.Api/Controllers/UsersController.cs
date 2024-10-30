using AutoMapper;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChattingApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }
        [HttpGet(Router.UserRouting.GetUsers)]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await userRepository.GetMembersAsync());
        }

        [HttpGet(Router.UserRouting.GetUser)]
        public async Task<ActionResult<MemberDto>> GetUser([FromRoute] string username)
        {
            return await userRepository.GetMemberAsync(username);
        }

        [HttpPut(Router.UserRouting.UpdateUser)]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await userRepository.GetUserByUsernameAsync(username);
            mapper.Map(memberUpdateDto, user);
            userRepository.Update(user);
            if (await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }
    }
}
