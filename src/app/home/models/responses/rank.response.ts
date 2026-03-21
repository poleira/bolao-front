export class RankResponse {
    usuario: string;
    pontuacao: number;

    constructor(params: Partial<RankResponse>) {
        this.usuario = params.usuario || '';
        this.pontuacao = params.pontuacao || 0;
    }
}
