using ChattingApp.Entities.Helpers.Pagination.Base;

namespace ChattingApp.Entities.Helpers.Pagination.Params
{
    public class MessageParams : PaginationParams
    {
        public string? Username { get; set; }
        public string Container { get; set; } = "Unread";
    }
}
