export class AssociarUsuarioRequest {

    HashBolao: string = '';
    Senha: string = '';
    HasUsuarioLogado: string = '';

    constructor(params: Partial<AssociarUsuarioRequest>) {
        this.HashBolao = params.HashBolao || '';
        this.Senha = params.Senha || '';
        this.HasUsuarioLogado = params.HasUsuarioLogado || '';
    }
}