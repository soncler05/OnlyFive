import { environment } from "src/environments/environment";

interface IAuthOpenIdProvider {
    readonly name: string;
    readonly issuer: string;
    readonly clientId: string;
}
export class AuthOpenIdProvider implements IAuthOpenIdProvider {
    readonly name: string;
    readonly issuer: string;
    readonly clientId: string;

    
    /**
     *
     */
     constructor(name: string, issuer: string, clientId: string) {
        this.name = name;
        this.issuer = issuer;
        this.clientId = clientId;
        
    }
}
export class AuthOpenIdProviders {
    readonly googleName = environment.openIdConnect.google.name;
    static PROVIDERS = [
         new AuthOpenIdProvider(environment.openIdConnect.google.name, 
            environment.openIdConnect.google.issuer, 
            environment.openIdConnect.google.clientId),
         ]
}

