export class AlterarNomeUsuarioRequest {
    novoNome: string;

    constructor(params: Partial<AlterarNomeUsuarioRequest>) {
        this.novoNome = params.novoNome || '';
    }
}
