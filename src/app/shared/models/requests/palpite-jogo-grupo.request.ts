export class PalpiteJogoGrupoRequest {
  HashBolao: string = '';
  IdGrupo: number = 0;
  IdSelecao1: number = 0;
  IdSelecao2: number = 0;
  PlacarSelecao1: number = 0;
  PlacarSelecao2: number = 0;

  constructor(params: Partial<PalpiteJogoGrupoRequest>) {
    this.HashBolao = params.HashBolao || '';
    this.IdGrupo = params.IdGrupo || 0;
    this.IdSelecao1 = params.IdSelecao1 || 0;
    this.IdSelecao2 = params.IdSelecao2 || 0;
    this.PlacarSelecao1 = params.PlacarSelecao1 || 0;
    this.PlacarSelecao2 = params.PlacarSelecao2 || 0;
  }
}
