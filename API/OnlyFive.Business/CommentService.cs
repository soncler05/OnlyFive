using AutoMapper;
using Microsoft.Extensions.Configuration;
using NETCore.MailKit.Core;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class CustomEmailService : ICustomEmailService
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        private const string CommentSubject = "Onlly Five - New Comment";
        private const string CommentBody = "Name: {0} \n" + "Email: {1} \n" + "Message: {2}";

        public CustomEmailService(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
        }
        public void SendComment(CommentDTO comment)
        {
            var message = string.Format(CommentBody, comment.Name, comment.Email, comment.Message);  
            _emailService.Send(_configuration["Email:SenderEmail"], CommentSubject, message);
        }
    }
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _repository;
        private readonly IMapper _mapper;
        public CommentService(ICommentRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<CommentDTO> Add(CommentDTO entity)
        {
            var result = await _repository.Add(_mapper.Map<Comment>(entity));
            return _mapper.Map<CommentDTO>(result);
        }
        public async Task<IEnumerable<CommentDTO>> GetList()
        {
            var result = await _repository.GetList();
            return _mapper.Map<IEnumerable<CommentDTO>>(result);
        }
    }
}
