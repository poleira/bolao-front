export class PalpiteArtilheiroResponse {
  id: number
  jogadorNome: string
  jogadorId: number

  constructor(params: Partial<PalpiteArtilheiroResponse>) {
    this.id = params.id || 0;
    this.jogadorNome = params.jogadorNome || '';
    this.jogadorId = params.jogadorId || 0;
  }
}
