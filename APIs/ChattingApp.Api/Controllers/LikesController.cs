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
    public class LikesController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly ILikeRepository likeRepository;

        public LikesController(IUserRepository userRepository, ILikeRepository likeRepository)
        {
            this.userRepository = userRepository;
            this.likeRepository = likeRepository;
        }

        [HttpPost(Router.LikeRouting.AddLike)]
        public async Task<ActionResult> AddLike([FromRoute] string username)
        {
            var sourceUserId = User.GetUserId();
            var sourceUser = await likeRepository.GetUserWithLikes(sourceUserId);

            var targetUser = await userRepository.GetUserByUsernameAsync(username);
            if (targetUser == null) return NotFound("User was not found");
            if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await likeRepository.GetUserLike(sourceUserId, targetUser.Id);
            if (userLike != null) return BadRequest($"You already liked {username}");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUser.Id
            };
            sourceUser.LikedUsers.Add(userLike);

            if (await userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like user");
        }

        [HttpGet(Router.LikeRouting.UserLikes)]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery] LikeParams likeParams)
        {
            likeParams.UserId = User.GetUserId();
            var likes = await likeRepository.GetUserLikes(likeParams);
            Response.AddPaginationHeader(likes.CurrentPage, likes.PageSize, likes.TotalCount, likes.TotalPages);
            return Ok(likes);
        }
    }
}
