using OnlyFive.Types.ModelsInterface;
using System;

namespace OnlyFive.Types.Models.Generic
{
    public class AuditableEntity : IAuditableEntity
    {
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
