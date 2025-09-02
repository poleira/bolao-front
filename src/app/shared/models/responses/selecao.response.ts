import { GrupoResponse } from "./grupo.response";

export class SelecaoResponse {
    id: number;
    nome: string;
    logo: string;
    pontuacaoSelecao: number;
    posicaoSelecaoFaseDeGrupos: number; 
    abreviacao: string;
    grupo?: GrupoResponse;

    constructor(params: Partial<SelecaoResponse>) {
        this.id = params.id || 0;
        this.nome = params.nome || '';
        this.logo = params.logo || '';
        this.pontuacaoSelecao = params.pontuacaoSelecao || 0;
        this.posicaoSelecaoFaseDeGrupos = params.posicaoSelecaoFaseDeGrupos || 0;
        this.abreviacao = params.abreviacao || '';
        this.grupo = params.grupo;
    }
}
