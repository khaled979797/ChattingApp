using ChattingApp.Entities.Helpers.Pagination.Base;

namespace ChattingApp.Entities.Helpers.Pagination.Params
{
    public class LikeParams : PaginationParams
    {
        public int UserId { get; set; }
        public string Predicate { get; set; }
    }
}
