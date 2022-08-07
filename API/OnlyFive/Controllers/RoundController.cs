using Microsoft.AspNetCore.Mvc;
using OnlyFive.BusinessInterface;
using OnlyFive.Types.DTOS;
using System.Threading.Tasks;

namespace OnlyFive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoundController : ControllerBase
    {
        private readonly IRoundService _roundService;

        public RoundController(IRoundService roundService)
        {
            _roundService = roundService;
        }

        [HttpPut("last")]
        public async Task<IActionResult> SaveLast([FromBody] LastRoundDTO round)
        {
            await _roundService.SaveLast(round);
            return Ok();
        }
    }
}
 