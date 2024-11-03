namespace ChattingApp.Entities.Helpers
{
    public static class Router
    {
        public const string SingleRoute = "/{id}";
        public const string root = "Api";
        public const string version = "V1";
        public const string Rule = root + "/" + version + "/";
        public static class UserRouting
        {
            public const string Prefix = Rule + "User";
            public const string GetUsers = Prefix + "/Users";
            public const string GetUser = Prefix + "/{username}";
            public const string UpdateUser = Prefix + "/UpdateUser";
            public const string AddPhoto = Prefix + "/AddPhoto";
            public const string SetMainPhoto = Prefix + "/SetMainPhoto" + SingleRoute;
            public const string DeletePhoto = Prefix + "/DeletePhoto" + SingleRoute;
        }

        public static class AccountRouting
        {
            public const string Prefix = Rule + "Account";
            public const string Register = Prefix + "/Register";
            public const string Login = Prefix + "/Login";
        }

        public static class BuggyRouting
        {
            public const string Prefix = Rule + "Buggy";
            public const string Auth = Prefix + "/Auth";
            public const string NotFound = Prefix + "/NotFound";
            public const string ServerError = Prefix + "/ServerError";
            public const string BadRequest = Prefix + "/BadRequest";
        }

        public static class LikeRouting
        {
            public const string Prefix = Rule + "Like";
            public const string AddLike = Prefix + "/{username}";
            public const string UserLikes = Prefix;
        }

        public static class MessageRouting
        {
            public const string Prefix = Rule + "Message";
            public const string CreateMessage = Prefix + "/CreateMessage";
            public const string GetMessages = Prefix + "/GetMessages";
            public const string GetMessageThread = Prefix + "/GetMessageThread/{username}";
            public const string DeleteMessage = Prefix + "/DeleteMessage" + SingleRoute;
        }
    }
}
