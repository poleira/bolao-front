import { GrupoResponse } from "./grupo.response";
import { SelecaoResponse } from "./selecao.response";

export class PalpiteGrupoSelecaoResponse {
  id: number;
  grupo: GrupoResponse;
  selecao: SelecaoResponse;
  pontuacaoSelecao?: number;
  posicaoSelecao: number;

  constructor(params: Partial<PalpiteGrupoSelecaoResponse>) {
    this.id = params.id || 0;
    this.grupo = params.grupo ? new GrupoResponse(params.grupo) : new GrupoResponse({});
    this.selecao = params.selecao ? new SelecaoResponse(params.selecao) : new SelecaoResponse({});
    this.pontuacaoSelecao = params.pontuacaoSelecao;
    this.posicaoSelecao = params.posicaoSelecao || 0;
  }
}
