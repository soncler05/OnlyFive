using OnlyFive.Types.DTOS;
using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface IRoundService
    {
        Task<RoundDTO> Create(RoundDTO entity);
        Task Update(RoundDTO entity);
    }
}
