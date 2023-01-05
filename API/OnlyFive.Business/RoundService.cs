using AutoMapper;
using OnlyFive.BusinessInterface;
using OnlyFive.RepositoryInterface;
using OnlyFive.Types.DTOS;
using OnlyFive.Types.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace OnlyFive.Business
{
    public class RoundService : IRoundService
    {
        private readonly IRoundRepository _repository;
        private readonly IMapper _mapper;
        private readonly IGameRepository _gameRepository;
        private const string PlayerId = "playerId";
        private const string Date = "date";

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
        public async Task SaveLast(LastRoundDTO entity)
        {
            var roundInDb = await _repository.Find(entity.Round.GameId, entity.Round.Offset);
            if (roundInDb == null)
                await Create(entity.Round);
            else
                await _repository.Update(roundInDb);

            await _gameRepository.Update(_mapper.Map<Game>(entity.Game));
        }
        public async Task<JsonObject> SaveNewPin(NewPinDTO entity, bool isLastPin = false)
        {
            var game = await _gameRepository.FindWithRound(entity.GameUrlId, entity.Offset);

            if (game == null || game.EndDate != null || (int)game.GameRound < entity.Offset)
                throw new Exception("Game not found or already ended");

            var roundInDb = game.Rounds.LastOrDefault();
            var (newPin, map) = AddPinToMap(roundInDb == null ? "[]" : roundInDb.PawnMap, entity.Pin);
            if (roundInDb == null)
            {
                await Create(new RoundDTO
                {
                    PawnMap = map,
                    EndDate = null,
                    StartDate = DateTime.UtcNow,
                    GameId = game.Id,
                    Offset = entity.Offset
                });
                game.LastRoundOffset = entity.Offset;
                await _gameRepository.Update(_mapper.Map<Game>(game)); 
            }
            else
            {
                roundInDb.PawnMap = map;
                if(isLastPin) roundInDb.EndDate = DateTime.UtcNow;
                await _repository.Update(roundInDb);
            }
            return newPin;
        }
        public async Task CompleteRound(CompleteRoundDTO entity)
        {
            var game = await _gameRepository.FindWithRound(entity.GameUrlId, entity.Offset);
            Round round = game == null ? null : game.Rounds.FirstOrDefault();
            if (game != null && game.EndDate == null
                && game.LastRoundOffset == entity.Offset && round != null
                && DeserializeMap(round.PawnMap).LastOrDefault()[PlayerId].ToString() == entity.PlayerId)
            {
                var now = DateTime.UtcNow;
                round.EndDate = now;
                await _repository.Update(round);
                if ((int)game.GameRound == entity.Offset)
                {
                    game.EndDate = now;
                    if (game.HostId == entity.PlayerId) game.HostScore++;
                    else if (game.GuestId == entity.PlayerId) game.GuestScore++;
                    await _gameRepository.Update(game);
                }
            }
            else throw new Exception("Could not complete round");
        }

        private (JsonObject, string) AddPinToMap(string map, JsonObject pin)
        {
            List<JsonObject> pinList = DeserializeMap(map);

            var lastPin = pinList.LastOrDefault();

            if (lastPin != null && lastPin[PlayerId] == pin[PlayerId])
                throw new Exception("It's not your turn");

            pin[Date] = DateTime.UtcNow;
            pinList.Add(pin);

            return (pin, JsonSerializer.Serialize(pinList));
        }

        private static List<JsonObject> DeserializeMap(string map) =>
            JsonSerializer.Deserialize<List<JsonObject>>(map);
    }
}
