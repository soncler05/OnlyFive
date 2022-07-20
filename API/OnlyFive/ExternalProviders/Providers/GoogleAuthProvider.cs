using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace OnlyFive.ExternalProviders
{
    public class GoogleAuthProvider : IGoogleAuthProvider
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public GoogleAuthProvider(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }
        public Provider Provider => ProviderDataSource.GetProviders(_configuration).First(x => x.Name == "Google");

        public JObject GetUserInfo(string accessToken)
        {
            var request = new Dictionary<string, string>();
            request.Add("token", accessToken);

            var result = _httpClient.GetAsync(Provider.UserInfoEndPoint + QueryBuilder.GetQuery(request, ExtrenalProviderEnum.Google)).Result;
            if (result.IsSuccessStatusCode)
            {
                var infoObject = JObject.Parse(result.Content.ReadAsStringAsync().Result);
                if (!ValidateUserInfo(infoObject))
                    throw new Exception("Invalid token");
                return infoObject;
            }
            return null;
        }
        private bool ValidateUserInfo(JObject userInfo)
        {
           var aud = userInfo.Value<string>("aud");

            return aud == Provider.ClientId;
        }
    }
}
