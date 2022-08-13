using System;

namespace OnlyFive.Types.Models
{
    public class Round
    {
        public int Offset { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string PawnMap { get; set; }
        public int GameId { get; set; }

        public virtual Game Game { get; set; }
    }
}
