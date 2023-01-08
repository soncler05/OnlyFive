using AutoMapper;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.Core.Enums;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class GameService : IGameService
    {
        private readonly IGameRepository _repository;
        private readonly IMapper _mapper;
        private readonly IConfigRepository _configRepository;

        public GameService(IGameRepository repository, IConfigRepository config, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper; 
            _configRepository = config;
        }
        public async Task<GameDTO> Create(GameDTO dto)
        {
            var entity = _mapper.Map<Game>(dto);

            entity.Config = new Config
            {
                GuestName = dto.GuestName,
                HostName = dto.HostName
            };

            var result = await _repository.Create(entity);

            return _mapper.Map<GameDTO>(result);
        }
        public async Task<GameDTO> Find(int id)
        {
            var result = await _repository.Find(id);
            return _mapper.Map<GameDTO>(result);
        }

        public async Task AddGuest(string roomId, string guestId, string deviceId, string userName)
        {
            var game = await _repository.FindByUrlId(roomId);
            game.GuestId = guestId;
            game.GuestDevice = deviceId;
            if(game.Config != null) game.Config.GuestName = userName;
            await _repository.Update(game);
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

        public async Task UpdateName(string urlId, string newName, UserTypeEnum userTypeEnum)
        {
            var config = await _configRepository.FindOnGoing(urlId);

            if (config == null) throw new Exception("Not found");

            if (userTypeEnum == UserTypeEnum.Host)
                config.HostName = newName;
            else if (userTypeEnum == UserTypeEnum.Host)
                config.GuestName = newName;

            await _configRepository.Update(config);
        }

        public async Task Delete(int id)
        {
            await _repository.Delete(id);
        }
    }
}
