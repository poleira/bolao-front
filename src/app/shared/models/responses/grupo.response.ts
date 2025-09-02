export class GrupoResponse {
    id: number;
    nome: string;

    constructor(params: Partial<GrupoResponse>) {
        this.id = params.id || 0;
        this.nome = params.nome || '';
    }
}
