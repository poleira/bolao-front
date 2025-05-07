export class BolaoRegraResponse {
    id: number;
    descricao: string;
    explicacao: string;
    pontuacao: number;

    constructor(params: Partial<BolaoRegraResponse>) {
        this.id = params.id || 0;
        this.descricao = params.descricao || '';
        this.explicacao = params.explicacao || '';
        this.pontuacao = params.pontuacao || 0;
    }
}