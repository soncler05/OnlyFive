using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface IDatabaseInitializerBusiness
    {
        Task SeedAsync();
    }
}
