export class BolaoListarRequest {
    Nome: string;

    constructor(params: Partial<BolaoListarRequest>) {
        this.Nome = params.Nome || "";
    }
}