using AutoMapper;
using ChattingApp.Core.Filters;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers;
using ChattingApp.Entities.Helpers.Extensions;
using ChattingApp.Entities.Helpers.Pagination;
using ChattingApp.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChattingApp.Api.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        private readonly IPhotoRepository photoRepository;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoRepository photoRepository)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
            this.photoRepository = photoRepository;
        }
        [HttpGet(Router.UserRouting.GetUsers)]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = user.UserName;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }
            var users = await userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }

        [HttpGet(Router.UserRouting.GetUser, Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser([FromRoute] string username)
        {
            return await userRepository.GetMemberAsync(username);
        }

        [HttpPut(Router.UserRouting.UpdateUser)]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            mapper.Map(memberUpdateDto, user);
            userRepository.Update(user);
            if (await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }

        [HttpPost(Router.UserRouting.AddPhoto)]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await photoRepository.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.Url.ToString(),
                PublicId = result.PublicId,
            };
            if (user.Photos?.Count == 0) photo.IsMain = true;
            user.Photos?.Add(photo);

            if (await userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem Adding Photo");
        }

        [HttpPut(Router.UserRouting.SetMainPhoto)]
        public async Task<ActionResult> SetMainPhoto(int id)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos?.FirstOrDefault(x => x.Id == id);
            if (photo.IsMain) return BadRequest("This already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to set main photo");
        }

        [HttpDelete(Router.UserRouting.DeletePhoto)]
        public async Task<ActionResult> DeletePhoto(int id)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos?.FirstOrDefault(x => x.Id == id);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You can't delete your main photo");
            if (photo.PublicId != null)
            {
                var result = await photoRepository.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);
            if (await userRepository.SaveAllAsync()) return Ok("Photo is deleted");
            return BadRequest("Failed to delete the photo");
        }
    }
}
