using AutoMapper;
using AutoMapper.QueryableExtensions;
using ChattingApp.Core.Context;
using ChattingApp.Core.Interfaces;
using ChattingApp.Entities.DTOs;
using ChattingApp.Entities.Helpers.Pagination.Base;
using ChattingApp.Entities.Helpers.Pagination.Params;
using ChattingApp.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace ChattingApp.Core.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;

        public MessageRepository(AppDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.Include(x => x.Sender).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.Recipient.UserName == messageParams.Username && !x.RecipientDeleted),
                "Outbox" => query.Where(x => x.Sender.UserName == messageParams.Username && !x.SenderDeleted),
                _ => query.Where(x => x.RecipientUsername == messageParams.Username && x.DateRead == null && !x.RecipientDeleted)
            };

            var messgesDto = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return PagedList<MessageDto>.Create(messgesDto, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                .Where(x => x.Sender.UserName == currentUsername &&
                x.Recipient.UserName == recipientUsername && !x.SenderDeleted
                ||
                x.Sender.UserName == recipientUsername &&
                x.Recipient.UserName == currentUsername && !x.RecipientDeleted)
                .OrderBy(x => x.MessageSent).ToListAsync();

            var unreadMessages = messages.Where(x => x.DateRead == null
                && x.Recipient.UserName == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach (var msg in unreadMessages)
                {
                    msg.DateRead = DateTime.Now;
                }
                await context.SaveChangesAsync();
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
