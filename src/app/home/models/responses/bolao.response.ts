export class BolaoResponse {
    Id: number;
    Nome: string;
    Logo: string;
    TokenAcesso: string;
    Aviso: string;
    Senha: string;

    constructor(params: Partial<BolaoResponse>) {
        this.Id = params.Id || 0;
        this.Nome = params.Nome || '';
        this.Logo = params.Logo || '';
        this.TokenAcesso = params.TokenAcesso || '';
        this.Aviso = params.Aviso || '';
        this.Senha = params.Senha || '';
    }
}