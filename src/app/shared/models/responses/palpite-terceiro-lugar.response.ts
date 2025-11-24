import { SelecaoResponse } from "./selecao.response";

export class PalpiteTerceiroLugarResponse {
  id: number
  selecao: SelecaoResponse
  posicao: number

  constructor(params: Partial<PalpiteTerceiroLugarResponse>) {
    this.id = params.id || 0;
    this.selecao = params.selecao || new SelecaoResponse({});
    this.posicao = params.posicao || 0;
  }
}
