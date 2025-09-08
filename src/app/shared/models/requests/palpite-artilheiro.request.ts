export class PalpiteArtilheiroRequest {
  HashBolao: string
  JogadorId: number

  constructor(params: Partial<PalpiteArtilheiroRequest>) {
    this.HashBolao = params.HashBolao || '';
    this.JogadorId = params.JogadorId || 0;
  }
}
