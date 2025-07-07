export class NotificacaoResponse {
    id: number;
    mensagem: string;
    tipo: number;
    lida: boolean;

    constructor(params: Partial<NotificacaoResponse>) {
        this.id = params.id ?? 0;
        this.mensagem = params.mensagem ?? '';
        this.tipo = params.tipo ?? 0;
        this.lida = params.lida ?? false;
    }
}