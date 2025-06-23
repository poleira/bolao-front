export class AssociarUsuarioViaHubRequest {

    NomeBolao: string = '';
    Senha: string = '';

    constructor(params: Partial<AssociarUsuarioViaHubRequest>) {
        this.NomeBolao = params.NomeBolao || '';
        this.Senha = params.Senha || '';
    }
}