using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;

namespace OnlyFive.ExternalProviders
{
    public class FacebookAuthProvider : IFacebookAuthProvider
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public FacebookAuthProvider(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }
        public Provider Provider => ProviderDataSource.GetProviders(_configuration).First(x => x.Name == "Facebook");

        public JObject GetUserInfo(string accessToken)
        {
            var query = string.Format(Provider.UserInfoEndPoint, accessToken);

            if (Provider == null)
            {
                throw new ArgumentNullException(nameof(Provider));
            }

            var request = new Dictionary<string, string>();

            request.Add("fields", "id,email,name,gender,birthday");
            request.Add("access_token", accessToken);

            var result = _httpClient.GetAsync(query).Result;
            if (result.IsSuccessStatusCode)
            {
                var infoObject = JObject.Parse(result.Content.ReadAsStringAsync().Result);
                return infoObject;
            }
            return null;

        }
    }
    public class TwitterAuthProvider : ITwitterAuthProvider
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public TwitterAuthProvider(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }
        public Provider Provider => ProviderDataSource.GetProviders(_configuration).First(x => x.Name == "Twitter");

        public JObject GetUserInfo(string accessToken)
        {
            var query = string.Format(Provider.UserInfoEndPoint, accessToken);

            if (Provider == null)
            {
                throw new ArgumentNullException(nameof(Provider));
            }

            var request = new Dictionary<string, string>();
            request.Add("tokenString", accessToken);
            request.Add("endpoint", Provider.UserInfoEndPoint);

            var authorizationHeaderParams = QueryBuilder.GetQuery(request, ExtrenalProviderEnum.Twitter);

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
            _httpClient.DefaultRequestHeaders.Add("Authorization", authorizationHeaderParams);

            var result = _httpClient.GetAsync(Provider.UserInfoEndPoint).Result;

            if (result.IsSuccessStatusCode)
            {
                var infoObject = JObject.Parse(result.Content.ReadAsStringAsync().Result);
                return infoObject;
            }
            return null;
        }
    }
}
