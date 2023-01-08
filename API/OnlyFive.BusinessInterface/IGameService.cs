using OnlyFive.Types.Core.Enums;
using OnlyFive.Types.DTOS;
using System.Threading.Tasks;

namespace OnlyFive.BusinessInterface
{
    public interface IGameService
    {
        Task<GameDTO> Create(GameDTO entity);
        Task Delete(int id);
        Task<GameDTO> Find(int id);
        Task<GameDTO> FindByUrlId(string urlId);
        Task Update(GameDTO entity);
        Task AddGuest(string roomId, string guestId, string deviceId, string userName);
        Task UpdateName(string urlId, string newName, UserTypeEnum userTypeEnum);
    }
}
