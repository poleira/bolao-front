import { InserirPremioBolaoRequest } from "./inserir-premio-bolao.request";
import { InserirRegraBolaoRequest } from "./inserir-regra-bolao.request";

export class BolaoEditarRequest {
    HashBolao: string;
    Nome: string;
    Logo: string;
    Aviso: string;
    Senha: string;
    Privado: boolean;
    InserirRegrasBoloes: InserirRegraBolaoRequest[]; 
    InserirPremiosBoloes: InserirPremioBolaoRequest[];
    IdModoJogo: number;

    constructor(params: Partial<BolaoEditarRequest>) {
        this.HashBolao = params.HashBolao || "";
        this.Nome = params.Nome || "";
        this.Logo = params.Logo || "";
        this.Aviso = params.Aviso || "";
        this.Senha = params.Senha || "";
        this.Privado = params.Privado ?? false;
        this.InserirRegrasBoloes = params.InserirRegrasBoloes || [];
        this.InserirPremiosBoloes = params.InserirPremiosBoloes || [];
        this.IdModoJogo = params.IdModoJogo || 1;
    }
}