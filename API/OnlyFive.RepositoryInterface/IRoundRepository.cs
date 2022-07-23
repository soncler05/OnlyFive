using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.RepositoryInterface
{
    public interface IRoundRepository
    {
        Task<Round> Create(Round entity);
        Task Update(Round entity);
        Task<Round> Find(int gameId, int offset);
    }

}
