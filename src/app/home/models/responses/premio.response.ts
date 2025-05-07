export class PremioResponse {
    id: number;
    descricao: string;
    colocacao: number;

    constructor(params: Partial<PremioResponse>) {
        this.id = params.id || 0;
        this.descricao = params.descricao || '';
        this.colocacao = params.colocacao || 0;
    }
}