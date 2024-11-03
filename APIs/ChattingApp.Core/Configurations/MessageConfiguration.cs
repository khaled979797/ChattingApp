using ChattingApp.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChattingApp.Core.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasOne(x => x.Recipient).WithMany(x => x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
