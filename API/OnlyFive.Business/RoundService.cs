using AutoMapper;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class RoundService : IRoundService
    {
        private readonly IRoundRepository _repository;
        private readonly IMapper _mapper;
        private readonly IGameRepository _gameRepository;

        public RoundService(IRoundRepository repository, IGameRepository gameRepository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
            _gameRepository = gameRepository;
        }
        public async Task<RoundDTO> Create(RoundDTO entity)
        {
            var result = await _repository.Create(_mapper.Map<Round>(entity));
            return _mapper.Map<RoundDTO>(result);
        }
        public async Task Update(RoundDTO entity)
        {
            await _repository.Update(_mapper.Map<Round>(entity));
        }
        public async Task SaveLast(RoundDTO entity)
        {
            var roundInDb = await _repository.Find(entity.GameId, entity.Offset);
            if (roundInDb == null)
                await Create(entity);
            else
                await _repository.Update(roundInDb);

            var game = await _gameRepository.Find(entity.GameId);
            game.LastRoundOffset = entity.Offset;
            await _gameRepository.Update(game);
        }
    }
}
