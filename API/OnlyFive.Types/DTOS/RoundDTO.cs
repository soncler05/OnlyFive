using System;

namespace OnlyFive.Types.DTOS
{
    public class RoundDTO
    {
        public int Offset { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string PawnMap { get; set; }
        public int GameId { get; set; }
    }
}
