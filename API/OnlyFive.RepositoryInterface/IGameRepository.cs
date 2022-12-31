using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.RepositoryInterface
{
    public interface IGameRepository
    {
        Task<Game> Create(Game entity);
        Task Delete(int id);
        Task<Game> Find(int id);
        Task<Game> FindByUrlId(string urlId);
        Task Update(Game entity);
        Task<Game> FindWithRound(string gameUrlId, int rounDOffset);
    }
}
