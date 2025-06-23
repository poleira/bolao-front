
export class BolaoListarResponse {
    nome: string;
    premio: string[];
    usuario: string;
    privado?: boolean;
    temSenha?: boolean;

    constructor(params: Partial<BolaoListarResponse>) {
        this.nome = params.nome || '';
        this.premio = params.premio || []
        this.usuario = params.usuario || '';
        this.privado = params.privado;
        this.temSenha = params.temSenha;
    }
}