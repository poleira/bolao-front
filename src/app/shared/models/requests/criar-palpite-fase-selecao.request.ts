export class CriarPalpiteFaseSelecaoRequest {

    IdFase: number = 0;
    IdSelecao: number = 0;
    HashBolao: string = '';

    constructor(params: Partial<CriarPalpiteFaseSelecaoRequest>) {
        this.IdFase = params.IdFase || 0;
        this.IdSelecao = params.IdSelecao || 0;
        this.HashBolao = params.HashBolao || '';
    }
}
