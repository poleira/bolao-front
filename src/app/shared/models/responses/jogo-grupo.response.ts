import { GrupoResponse } from './grupo.response';
import { SelecaoResponse } from './selecao.response';

export class JogoGrupoResponse {
  id: number;
  selecao1?: SelecaoResponse;
  selecao2?: SelecaoResponse;
  placarSelecao1?: number;
  placarSelecao2?: number;
  dataHora?: string;
  grupo?: GrupoResponse;

  constructor(params: Partial<JogoGrupoResponse>) {
    this.id = params.id || 0;
    this.selecao1 = params.selecao1;
    this.selecao2 = params.selecao2;
    this.placarSelecao1 = params.placarSelecao1;
    this.placarSelecao2 = params.placarSelecao2;
    this.dataHora = params.dataHora;
    this.grupo = params.grupo;
  }
}
