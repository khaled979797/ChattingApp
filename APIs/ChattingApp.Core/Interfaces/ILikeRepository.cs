﻿using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers.Pagination;
using ChattingApp.Entities.Models;

namespace ChattingApp.Core.Interfaces
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<LikeDto>> GetUserLikes(LikeParams likeParams);
    }
}