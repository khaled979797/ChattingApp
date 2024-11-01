namespace ChattingApp.Entities.Helpers.Pagination
{
    public class PaginationParams
    {
        private const int maxSize = 50;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 10;

        public int PageSize
        {
            get => pageSize;
            set => pageSize = value > maxSize ? maxSize : value;
        }
    }
}
