using ChattingApp.Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChattingApp.Core.Configurations
{
    public class UserLikeConfiguration : IEntityTypeConfiguration<UserLike>
    {
        public void Configure(EntityTypeBuilder<UserLike> builder)
        {
            builder.HasKey(x => new { x.SourceUserId, x.TargetUserId });

            builder.HasOne(x => x.TargetUser).WithMany(x => x.LikedByUsers)
                .HasForeignKey(x => x.TargetUserId).OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.SourceUser).WithMany(x => x.LikedUsers)
                .HasForeignKey(x => x.SourceUserId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
