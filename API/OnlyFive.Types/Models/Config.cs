namespace OnlyFive.Types.Models
{
    public class Config
    {
        public int GameId { get; set; }
        public string HostName { get; set; }
        public string GuestName { get; set; }

        public virtual Game Game { get; set; }
    }
}
