using System.Threading.Tasks;

namespace OnlyFive.RepositoryInterface
{
    public interface IDatabaseInitializerRepository
    {
        Task SeedAsync();
    }
}
