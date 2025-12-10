import { JogoEliminatoriaResponse } from "./jogo-eliminatoria.response";
import { SelecaoResponse } from "./selecao.response";

export class EliminatoriasResponse {
    rodadaDe16: JogoEliminatoriaResponse[];
    oitavas: JogoEliminatoriaResponse[];
    quartas: JogoEliminatoriaResponse[];
    semis: JogoEliminatoriaResponse[];
    finais?: JogoEliminatoriaResponse;
    disputaDeTerceiro?: JogoEliminatoriaResponse;
    campeao?: SelecaoResponse;
    terceiroLugar?: SelecaoResponse;

    constructor(params: Partial<EliminatoriasResponse>) {
        this.rodadaDe16 = params.rodadaDe16 || [];
        this.oitavas = params.oitavas || [];
        this.quartas = params.quartas || [];
        this.semis = params.semis || [];
        this.finais = params.finais;
        this.disputaDeTerceiro = params.disputaDeTerceiro;
        this.campeao = params.campeao;
        this.terceiroLugar = params.terceiroLugar;
    }
}
