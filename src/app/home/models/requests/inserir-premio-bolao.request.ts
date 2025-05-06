export class InserirPremioBolaoRequest {
    Descricao: string;
    Colocacao: number;
    HashBolao: string;

    constructor(params: Partial<InserirPremioBolaoRequest>) {
        this.Descricao = params.Descricao || "";
        this.Colocacao = params.Colocacao || 0;
        this.HashBolao = params.HashBolao || "";
    }
}