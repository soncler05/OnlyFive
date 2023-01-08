using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.SignalR;
using OnlyFive.BusinessInterface;
using System.Net.NetworkInformation;
using System.Text.Json;
using System.Collections.Immutable;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using OnlyFive.Types.Core.Enums;
using System.Text.Json.Nodes;

namespace OnlyFive.Hubs
{

    public class RoomHub : Hub
    {
        private readonly IGameService _gameService;
        private const string MAIN_STREAM = "mainStream";
        public RoomHub(IGameService gameService)
        {
            _gameService = gameService;
        }
        private static JsonSerializerOptions SerializerOpts 
        { 
            get 
            {
                return new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
            } 
        }
        public async Task JoinRoom(string roomId, string playerId, string deviceId, string userName)
        {
            var game = await _gameService.FindByUrlId(roomId);
            if(game != null)
            {
                 await Groups.AddToGroupAsync(Context.ConnectionId, PlaceRoomNameBuilder(roomId));
                if (game.GuestId == null && game.HostId != playerId)
                {
                    await _gameService.AddGuest(roomId, playerId, deviceId, userName);
                    var data = new { PlayerId = playerId, DeviceId = deviceId, UserName = userName };
                    var dto = new HubDTO 
                    { 
                        Type = HubDataTypeEnum.Guest, 
                        Data = JsonSerializer.Serialize(data, SerializerOpts) 
                    };
                    await Clients.Group(PlaceRoomNameBuilder(roomId)).SendAsync(MAIN_STREAM, dto);
                }
                
            }
        }
        public Task LeftRoom(string roomId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, PlaceRoomNameBuilder(roomId));
        }

        private static string PlaceRoomNameBuilder(string roomId)
        {
            return "room_" + roomId;
        }

        public static Task SendPin(IHubContext<RoomHub> hubContext, string userConnectionId, string roomId, JsonObject pin)
        {
            var data = new HubDTO { Type = HubDataTypeEnum.Pin, Data = JsonSerializer.Serialize(pin, SerializerOpts) };
            return hubContext.Clients.GroupExcept(PlaceRoomNameBuilder(roomId), userConnectionId).SendAsync(MAIN_STREAM, data);
        }
        public Task SendPing(string roomId)
        {
            var data = new HubDTO { Type = HubDataTypeEnum.Ping, Data = null };
            return Clients.OthersInGroup(PlaceRoomNameBuilder(roomId)).SendAsync(MAIN_STREAM, data);
        }
        public static Task NewUserName(IHubContext<RoomHub> hubContext, string userConnectionId,  string roomId, UserTypeEnum playerType, string userName)
        {
            var data = new { PlayerType = playerType, UserName = userName };
            var dto = new HubDTO
            {
                Type = HubDataTypeEnum.NewUserName,
                Data = JsonSerializer.Serialize(data, SerializerOpts)
            };

            //var data = new HubDTO { Type = dataType, Data = dto };
            return hubContext.Clients.GroupExcept(RoomHub.PlaceRoomNameBuilder(roomId), userConnectionId).SendAsync(RoomHub.MAIN_STREAM, dto);
        }

        public override async Task OnConnectedAsync()
        {
            //Console.WriteLine(Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            //Console.WriteLine(Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }
    }
    public enum HubDataTypeEnum
    {
        Ping = 1,
        Guest,
        Host,
        NewUserName,
        Pin
    }
    public class HubDTO
    {
        public HubDataTypeEnum Type { get; set; }
        public string Data { get; set; }
    }
}
