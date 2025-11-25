import { JogoEliminatoriaResponse } from "./jogo-eliminatoria.response";

export class EliminatoriasResponse {
    rodadaDe16: JogoEliminatoriaResponse[];
    oitavas: JogoEliminatoriaResponse[];
    quartas: JogoEliminatoriaResponse[];
    semis: JogoEliminatoriaResponse[];
    finais?: JogoEliminatoriaResponse;

    constructor(params: Partial<EliminatoriasResponse>) {
        this.rodadaDe16 = params.rodadaDe16 || [];
        this.oitavas = params.oitavas || [];
        this.quartas = params.quartas || [];
        this.semis = params.semis || [];
        this.finais = params.finais;
    }
}
