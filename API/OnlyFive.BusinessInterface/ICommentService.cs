using OnlyFive.Types.DTOS;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface ICommentService
    {
        Task<CommentDTO> Add(CommentDTO entity);
        Task<IEnumerable<CommentDTO>> GetList();
    }
}
