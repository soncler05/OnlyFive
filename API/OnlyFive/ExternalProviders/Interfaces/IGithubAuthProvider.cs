namespace OnlyFive.ExternalProviders
{
    public interface IGithubAuthProvider : IExternalAuthProvider
    {
        Provider Provider { get; }
    }
}
