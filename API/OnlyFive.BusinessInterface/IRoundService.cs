using OnlyFive.Types.DTOS;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface IRoundService
    {
        Task<RoundDTO> Create(RoundDTO entity);
        Task Update(RoundDTO entity);
        Task SaveLast(LastRoundDTO entity);
        Task<JsonObject> SaveNewPin(NewPinDTO entity, bool isLastPin = false);
        Task CompleteRound(CompleteRoundDTO entity);
    }
}
