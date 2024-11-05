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

        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await context.Connections.FirstOrDefaultAsync(x => x.ConnectionId == connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await context.Groups.Include(x => x.Connections)
                .Where(x => x.Connections.Any(x => x.ConnectionId == connectionId)).FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.Include(x => x.Sender).Include(x => x.Recipient).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages.OrderByDescending(x => x.MessageSent)
                .ProjectTo<MessageDto>(mapper.ConfigurationProvider).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.RecipientUsername == messageParams.Username && !x.RecipientDeleted),
                "Outbox" => query.Where(x => x.SenderUsername == messageParams.Username && !x.SenderDeleted),
                _ => query.Where(x => x.RecipientUsername == messageParams.Username && x.DateRead == null && !x.RecipientDeleted)
            };

            return PagedList<MessageDto>.Create(query, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Where(x => x.Sender.UserName == currentUsername &&
                x.Recipient.UserName == recipientUsername && !x.SenderDeleted
                ||
                x.Sender.UserName == recipientUsername &&
                x.Recipient.UserName == currentUsername && !x.RecipientDeleted)
                .OrderBy(x => x.MessageSent)
                .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            var unreadMessages = messages.Where(x => x.DateRead == null
                && x.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var msg in unreadMessages)
                {
                    msg.DateRead = DateTime.UtcNow;
                }
            }

            return messages;
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }
    }
}
