using AutoMapper;
using AutoMapper.QueryableExtensions;
using ChattingApp.Core.Context;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers.Pagination;
using ChattingApp.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace ChattingApp.Core.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;

        public UserRepository(AppDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await context.Users.Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider).FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);

            var minDateOfBirth = DateTime.Now.AddYears(-userParams.MaxAge - 1);
            var maxDateOfBirth = DateTime.Now.AddYears(-userParams.MinAge);
            query = query.Where(x => x.DateOfBirth >= minDateOfBirth && x.DateOfBirth <= maxDateOfBirth);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return PagedList<MemberDto>.Create(query.AsNoTracking().ProjectTo<MemberDto>
                (mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users.Include(x => x.Photos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}
