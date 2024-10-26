﻿namespace ChattingApp.Entities.Helpers
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
            public const string GetUser = Prefix + SingleRoute;
        }

        public static class AccountRouting
        {
            public const string Prefix = Rule + "Account";
            public const string Register = Prefix + "/Register";
            public const string Login = Prefix + "/Login";
        }
    }
}
