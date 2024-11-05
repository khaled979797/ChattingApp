using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers.Pagination.Base;
using ChattingApp.Entities.Helpers.Pagination.Params;
using ChattingApp.Entities.Models;

namespace ChattingApp.Core.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username);
        Task<string> GetUserGender(string username);
    }
}
