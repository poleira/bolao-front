import { RegraResponse } from "./regra.response";

export class BolaoRegraResponse {
    id: number;
    regra!: RegraResponse;
    descricao: string;
    explicacao: string;
    pontuacao: number;

    constructor(params: Partial<BolaoRegraResponse>) {
        this.id = params.id || 0;
        this.regra != params.regra;
        this.descricao = params.descricao || '';
        this.explicacao = params.explicacao || '';
        this.pontuacao = params.pontuacao || 0;
    }
}