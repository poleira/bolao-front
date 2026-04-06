export class PalpitesPorEscritoResponse {
    palpiteFaseGrupos: string;
    palpiteEliminatorias: string;
    palpiteMelhoresTerceiros: string;
    palpiteArtilheiro: string;
    palpiteResultadosJogosBrasil: string;
    palpiteArtilheiroBrasil: string;

    constructor(params: Partial<PalpitesPorEscritoResponse>) {
        this.palpiteFaseGrupos = params.palpiteFaseGrupos || '';
        this.palpiteEliminatorias = params.palpiteEliminatorias || '';
        this.palpiteMelhoresTerceiros = params.palpiteMelhoresTerceiros || '';
        this.palpiteArtilheiro = params.palpiteArtilheiro || '';
        this.palpiteResultadosJogosBrasil = params.palpiteResultadosJogosBrasil || '';
        this.palpiteArtilheiroBrasil = params.palpiteArtilheiroBrasil || '';
    }
}
