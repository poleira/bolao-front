export class RegraResponse {
    id: number;
    descricao: string;
    explicacao: string;

    constructor(params: Partial<RegraResponse>) {
        this.id = params.id || 0;
        this.descricao = params.descricao || '';
        this.explicacao = params.explicacao || '';
    }
}