export class AssociarUsuarioRequest {

    HashBolao: string = '';
    Senha: string = '';
    IdUsuarioASerAlterado?: number;

    constructor(params: Partial<AssociarUsuarioRequest>) {
        this.HashBolao = params.HashBolao || '';
        this.Senha = params.Senha || '';
        this.IdUsuarioASerAlterado = params.IdUsuarioASerAlterado;
    }
}