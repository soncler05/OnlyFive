using System.Text.Json.Nodes;

namespace OnlyFive.Types.DTOS
{
    public class NewPinDTO
    {
        public int Offset { get; set; }
        public JsonObject Pin { get; set; }
        public string GameUrlId { get; set; }
    }
}
