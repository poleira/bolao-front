import { SelecaoResponse } from "./selecao.response";

export class JogoEliminatoriaResponse {
    numeroJogo: number;
    fase: string;
    selecao1?: SelecaoResponse;
    selecao2?: SelecaoResponse;
    proximoJogoVencedor?: number;

    constructor(params: Partial<JogoEliminatoriaResponse>) {
        this.numeroJogo = params.numeroJogo || 0;
        this.fase = params.fase || '';
        this.selecao1 = params.selecao1;
        this.selecao2 = params.selecao2;
        this.proximoJogoVencedor = params.proximoJogoVencedor;
    }
}
