using System;

namespace OnlyFive.Types.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public DateTime Date { get; }
    }
}
