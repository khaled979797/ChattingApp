using AutoMapper;
using ChattingApp.Core.Context;
using ChattingApp.Core.Interfaces;

namespace ChattingApp.Core.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;
        public IUserRepository UserRepository => new UserRepository(context, mapper);
        public IMessageRepository MessageRepository => new MessageRepository(context, mapper);
        public ILikeRepository LikeRepository => new LikeRepository(context);
        public UnitOfWork(AppDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
