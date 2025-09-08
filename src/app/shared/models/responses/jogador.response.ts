export class JogadorResponse {
  id: number;
  nome: string;

  constructor(params: Partial<JogadorResponse>) {
    this.id = params.id || 0;
    this.nome = params.nome || '';
  }
}
