namespace ChattingApp.Core.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> onlineUsers = new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;
            lock (onlineUsers)
            {
                if (onlineUsers.ContainsKey(username))
                {
                    onlineUsers[username].Add(connectionId);
                }
                else
                {
                    onlineUsers.Add(username, new List<string> { connectionId });
                    isOnline = true;
                }
            }
            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;
            lock (onlineUsers)
            {
                if (!onlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                onlineUsers[username].Remove(connectionId);
                if (onlineUsers[username].Count == 0)
                {
                    onlineUsers.Remove(username);
                    isOffline = true;
                }
            }
            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            lock (onlineUsers)
            {
                return Task.FromResult(onlineUsers.Select(k => k.Key).ToArray());
            }
        }

        public Task<List<string>> GetCeonnectionsForUser(string username)
        {
            lock (onlineUsers)
            {
                return Task.FromResult(onlineUsers.GetValueOrDefault(username));
            }
        }
    }
}
