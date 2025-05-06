export class InserirRegraBolaoRequest {
    IdRegra: number;
    HashBolao: string;
    Pontuacao: number;

    constructor(params: Partial<InserirRegraBolaoRequest>) {
        this.IdRegra = params.IdRegra || 0;
        this.HashBolao = params.HashBolao || "";
        this.Pontuacao = params.Pontuacao || 0;
    }
}