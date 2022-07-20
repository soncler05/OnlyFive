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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoundDTO round)
        {
            round = await _roundService.Create(round);
            return Ok(round);
        }
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] RoundDTO round)
        {
            await _roundService.Update(round);
            return Ok();
        }
    }
}
 