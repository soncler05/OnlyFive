using AutoMapper;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _repository;
        private readonly IMapper _mapper;
        public GameService(IGameRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<GameDTO> Create(GameDTO entity)
        {
            var result = await _repository.Create(_mapper.Map<Game>(entity));
            return _mapper.Map<GameDTO>(result);
        }
        public async Task<GameDTO> Find(int id)
        {
            var result = await _repository.Find(id);
            return _mapper.Map<GameDTO>(result);
        }
        public async Task<GameDTO> FindByUrlId(string urlId)
        {
            var result = await _repository.FindByUrlId(urlId);
            return _mapper.Map<GameDTO>(result);
        }
        public async Task Update(GameDTO entity)
        {
            await _repository.Update(_mapper.Map<Game>(entity));
        }
        public async Task Delete(int id)
        {
            await _repository.Delete(id);
        }
    }
}
