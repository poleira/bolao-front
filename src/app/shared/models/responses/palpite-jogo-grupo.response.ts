import { GrupoResponse } from "./grupo.response";
import { SelecaoResponse } from "./selecao.response";

export class PalpiteJogoGrupoResponse {
  id: number;
  grupo: GrupoResponse;
  selecao1: SelecaoResponse;
  selecao2: SelecaoResponse;
  placarSelecao1: number;
  placarSelecao2: number;

  constructor(params: Partial<PalpiteJogoGrupoResponse>) {
    this.id = params.id || 0;
    this.grupo = params.grupo ? new GrupoResponse(params.grupo) : new GrupoResponse({});
    this.selecao1 = params.selecao1 ? new SelecaoResponse(params.selecao1) : new SelecaoResponse({});
    this.selecao2 = params.selecao2 ? new SelecaoResponse(params.selecao2) : new SelecaoResponse({});
    this.placarSelecao1 = params.placarSelecao1 || 0;
    this.placarSelecao2 = params.placarSelecao2 || 0;
  }
}
