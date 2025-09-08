export class JogadorListarRequest {
  Nome: string

  constructor(params: Partial<JogadorListarRequest>) {
    this.Nome = params.Nome || '';
  }
}