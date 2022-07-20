//using Newtonsoft.Json.Linq;
//using System.Linq;
//using System.Net.Http;

//namespace OnlyFive.ExternalProviders
//{
//    public class MyCustomProvider : IMyCustomProvider
//    {

//        private readonly HttpClient _httpClient;
//        public MyCustomProvider(HttpClient httpClient)
//        {
//            _httpClient = httpClient;
//        }

//        public Provider provider => ProviderDataSource.GetProviders().First(x => x.Name.ToLower() == "ss");

//        //public Provider =>_providerRepository.Get()
//        //                            .FirstOrDefault(x => x.Name.ToLower() == ProviderType.MyCustomProvider.ToString().ToLower());

//        public Provider GetProvider(ExtrenalProviderEnum provider)
//        {
//            return ProviderDataSource.GetProviders().First(x => x.Name.ToLower() == provider.ToString());
//        }

//        public JObject GetUserInfo(string accessToken)
//        {
//            var query = "[build your request according to your providers configuration]";

//            var result = _httpClient.GetAsync(provider.UserInfoEndPoint + query).Result;
//            if (result.IsSuccessStatusCode)
//            {
//                var infoObject = JObject.Parse(result.Content.ReadAsStringAsync().Result);
//                return infoObject;
//            }
//            return null;

//        }
//    }
//}
