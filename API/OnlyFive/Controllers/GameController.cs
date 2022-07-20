using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlyFive.BusinessInterface;
using OnlyFive.Types.DTOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlyFive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GameDTO game)
        {
            game = await _gameService.Create(game);
            return Ok(game);
        }
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] GameDTO game)
        {
            await _gameService.Update(game);
            return Ok();
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int gameId)
        {
            await _gameService.Delete(gameId);
            return Ok();
        }
        [HttpGet("{gameId}")]
        public async Task<IActionResult> Find(int gameId)
        {
            return Ok(await _gameService.Find(gameId));
        }
        [HttpGet("urlId/{urlId}")]
        public async Task<IActionResult> Find(string urlId)
        {
            var result = await _gameService.FindByUrlId(urlId);
            return Ok(result);
        }
    }
}
 