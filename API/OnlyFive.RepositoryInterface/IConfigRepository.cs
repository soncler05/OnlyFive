using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.RepositoryInterface
{
    public interface IConfigRepository
    {
        Task Update(Config entity);
        Task<Config> FindOnGoing(string urlId);
    }

}
