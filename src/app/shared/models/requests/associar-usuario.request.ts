export class AssociarUsuarioRequest {

    HashBolao: string = '';
    Senha: string = '';

    constructor(params: Partial<AssociarUsuarioRequest>) {
        this.HashBolao = params.HashBolao || '';
        this.Senha = params.Senha || '';
    }
}