export class PalpiteTerceiroLugarRequest {
  HashBolao: string = '';
  IdSelecao: number = 0;
  Posicao: number;

  constructor(params: Partial<PalpiteTerceiroLugarRequest>) {
    this.HashBolao = params.HashBolao || '';
    this.IdSelecao = params.IdSelecao || 0;
    this.Posicao = params.Posicao || 0;
  }
}
