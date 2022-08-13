namespace OnlyFive.ExternalProviders
{
    public interface IFacebookAuthProvider : IExternalAuthProvider
    {
        Provider Provider { get; }
    }
}
