using ChattingApp.Entities.Models;

namespace ChattingApp.Core.Interfaces
{
    public interface ITokenRepository
    {
        Task<string> CreateToken(AppUser user);
    }
}
