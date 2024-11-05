using System.ComponentModel.DataAnnotations;

namespace ChattingApp.Entities.Models
{
    public class Group
    {
        public Group(string name)
        {
            Name = name;
            Connections = new HashSet<Connection>();
        }

        [Key]
        public string Name { get; set; }
        public ICollection<Connection> Connections { get; set; }
    }
}