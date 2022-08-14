using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System;
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
    }
}
