using Microsoft.AspNetCore.Mvc;
using OnlyFive.BusinessInterface;
using OnlyFive.Types.DTOS;
using Serilog;
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

        public CommentController(ICommentService service, ICustomEmailService emailService, IServiceProvider serviceProvider)
        {
            _service = service;
            _emailService = emailService;
            _serviceProvider = serviceProvider;
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
                    Log.Error(ex.Message);
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
 