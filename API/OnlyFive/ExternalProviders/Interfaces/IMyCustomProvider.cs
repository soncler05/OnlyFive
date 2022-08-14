namespace OnlyFive.ExternalProviders
{
    public interface IMyCustomProvider : IExternalAuthProvider
    {
        Provider provider { get; }
    }
}
