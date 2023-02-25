using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OnlyFive.BusinessInterface;
using OnlyFive.Types.DTOS;
using System;
using System.Threading.Tasks;

namespace OnlyFive.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _service;
        private readonly ICustomEmailService _emailService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CommentController> _logger;

        public CommentController(ICommentService service, ICustomEmailService emailService, IServiceProvider serviceProvider,
            ILogger<CommentController> logger)
        {
            _service = service;
            _emailService = emailService;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CommentDTO dto)
        {
            dto = await _service.Add(dto);
            SendEmail(dto);

            return Ok(dto);
        }


        private void SendEmail(CommentDTO dto)
        {
            _ = Task.Run(() =>
            {
                try
                {
                    _emailService.SendComment(dto);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                }
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetList()
        {
            return Ok(await _service.GetList());
        }
    }
}
 