﻿namespace OnlyFive.Types.DTOS
{
    public class ApplicationUserDTO
    {
        public string Id { get; set; }
        public string PlayerId { get { return Id; } }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
    }
}
