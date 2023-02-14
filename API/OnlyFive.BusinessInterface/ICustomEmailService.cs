using OnlyFive.Types.DTOS;
using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface ICustomEmailService
    {
        void SendComment(CommentDTO entity);
    }
}
