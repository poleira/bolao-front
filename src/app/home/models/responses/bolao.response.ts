import { BolaoRegraResponse } from "src/app/home/models/responses/bolao-regra.response";
import { PremioResponse } from "src/app/home/models/responses/premio.response";

export class BolaoResponse {
    id: number;
    nome: string;
    logo: string;
    tokenAcesso: string;
    aviso: string;
    senha: string;
    privacidade: boolean;
    premios: PremioResponse[];
    regras: BolaoRegraResponse[];

    constructor(params: Partial<BolaoResponse>) {
        this.id = params.id || 0;
        this.nome = params.nome || '';
        this.logo = params.logo || '';
        this.tokenAcesso = params.tokenAcesso || '';
        this.aviso = params.aviso || '';
        this.senha = params.senha || '';
        this.privacidade = params.privacidade || false;
        this.premios = params.premios || [];
        this.regras = params.regras || [];
    }
}