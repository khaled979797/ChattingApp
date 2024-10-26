using ChattingApp.Entities.Models;

namespace ChattingApp.Core.Interfaces
{
    public interface ITokenRepository
    {
        string CreateToken(AppUser user);
    }
}
