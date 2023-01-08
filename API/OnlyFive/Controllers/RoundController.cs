using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OnlyFive.BusinessInterface;
using OnlyFive.Hubs;
using OnlyFive.Types.DTOS;
using System.Threading.Tasks;

namespace OnlyFive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundController : ControllerBase
    {
        private readonly IRoundService _roundService;
        private readonly IHubContext<RoomHub> _hubContext;

        public RoundController(IRoundService roundService, IHubContext<RoomHub> hubContext)
        {
            _roundService = roundService;
            _hubContext = hubContext;
        }

        [HttpPut("last")]
        public async Task<IActionResult> SaveLast([FromBody] LastRoundDTO round)
        {
            await _roundService.SaveLast(round);
            return Ok();
        }

        [HttpPut("newPin")]
        public async Task<IActionResult> SaveNewPin([FromBody] NewPinDTO entity)
        {
            var pin = await _roundService.SaveNewPin(entity);
            await RoomHub.SendPin(_hubContext, HttpContext.Connection.Id, entity.GameUrlId, pin);
            return Ok(pin);
        }

        [HttpPut("complete")]
        public async Task<IActionResult> CompleteRound([FromBody] CompleteRoundDTO entity)
        {
            await _roundService.CompleteRound(entity);
            return Ok();
        }
    }
}
 