using OnlyFive.Types.Core.Enums;
using System;
using System.Collections.Generic;

namespace OnlyFive.Types.DTOS
{
    public class GameDTO
    {
        public int Id { get; set; }
        public string UrlId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string HostDevice { get; set; }
        public string GuestDevice { get; set; }
        public string HostId { get; set; }
        public string GuestId { get; set; }
        public int HostScore { get; set; }
        public int GuestScore { get; set; }
        public GameRoundsEnum GameRound { get; set; }
        public int LastRoundOffset { get; set; }
        public string HostName { get; set; }
        public string GuestName { get; set; }

        public ApplicationUserDTO Host { get; set; }
        public ApplicationUserDTO Guest { get; set; }
        public RoundDTO LastRound { get; set; }
    }
}
