using OnlyFive.Types.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnlyFive.RepositoryInterface
{
    public interface ICommentRepository
    {
        Task<Comment> Add(Comment entity);
        Task<IEnumerable<Comment>> GetList();
    }

}
