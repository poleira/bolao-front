export class PalpiteGrupoSelecaoRequest {
  HashBolao: string = '';
  IdGrupo: number = 0;
  IdSelecao: number = 0;
  PontuacaoSelecao?: number;
  PosicaoSelecao: number = 0;

  constructor(params: Partial<PalpiteGrupoSelecaoRequest>) {
    this.HashBolao = params.HashBolao || '';
    this.IdGrupo = params.IdGrupo || 0;
    this.IdSelecao = params.IdSelecao || 0;
    this.PontuacaoSelecao = params.PontuacaoSelecao;
    this.PosicaoSelecao = params.PosicaoSelecao || 0;
  }
}
