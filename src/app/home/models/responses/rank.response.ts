export class RankResponse {
    usuario: string;
    pontuacao: number;
    idUsuario: number;

    constructor(params: Partial<RankResponse>) {
        this.usuario = params.usuario || '';
        this.pontuacao = params.pontuacao || 0;
        this.idUsuario = params.idUsuario || 0;
    }
}
