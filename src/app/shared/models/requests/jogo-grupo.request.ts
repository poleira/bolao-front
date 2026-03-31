export class JogoGrupoRequest {
  hashBolao?: string;
  idGrupo?: number;

  constructor(params: Partial<JogoGrupoRequest>) {
    this.hashBolao = params.hashBolao;
    this.idGrupo = params.idGrupo;
  }
}
