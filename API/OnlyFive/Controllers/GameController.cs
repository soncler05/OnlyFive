using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OnlyFive.BusinessInterface;
using OnlyFive.Hubs;
using OnlyFive.Types.Core.Enums;
using OnlyFive.Types.DTOS;
using System;
using System.Threading.Tasks;

namespace OnlyFive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IHubContext<RoomHub> _hubContext;
        private readonly ILogger _logger;

        public GameController(IGameService gameService, IHubContext<RoomHub> hubContext, ILogger<GameController> logger)
        {
            _gameService = gameService;
            _hubContext = hubContext;
            _logger = logger;
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
            try
            {
                await _gameService.Update(game);
                return Ok();
            }
            catch (Exception ex )
            {
                //Log.Error(ex.Message);
                throw;
            }
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
            _logger.LogInformation($"{nameof(Find)} started");
            var result = await _gameService.FindByUrlId(urlId);
            if (result != null)
                return Ok(result);
            else
                return NotFound();
        }

        [HttpPut("userName/{urlId}/{newName}/{userType}")]
        public async Task<IActionResult> NewUserName(string urlId, string newName, UserTypeEnum userType)
        {
                await _gameService.UpdateName(urlId, newName, userType);
                await RoomHub.NewUserName(_hubContext, HttpContext.Connection.Id, urlId, userType, newName);
                return Ok();
        }
    }
}
 