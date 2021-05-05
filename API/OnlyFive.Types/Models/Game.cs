using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OnlyFive.Types.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string HostDevice { get; set; }
        public string GuestDevice { get; set; }
        public string PawnMap { get; set; }
        public string HostId { get; set; }
        public string GuestId { get; set; }

        public virtual ApplicationUser Host { get; set; }
        public virtual ApplicationUser Guest { get; set; }
    }
}
