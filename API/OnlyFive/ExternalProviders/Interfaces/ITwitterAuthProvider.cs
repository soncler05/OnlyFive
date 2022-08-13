namespace OnlyFive.ExternalProviders
{
    public interface ITwitterAuthProvider : IExternalAuthProvider
    {
        Provider Provider { get; }
    }
}
