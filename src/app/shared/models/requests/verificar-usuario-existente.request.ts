export class VerificarUsuarioExistenteRequest {
    Nome: string;
    Email: string;

    constructor(params: Partial<VerificarUsuarioExistenteRequest>) {
        this.Nome = params.Nome || '';
        this.Email = params.Email || '';
    }
}
