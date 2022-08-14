using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace OnlyFive.ExternalProviders
{
    public interface IExternalAuthProvider
    {
        JObject GetUserInfo(string accessToken);
    }
}
