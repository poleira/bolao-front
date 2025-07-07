export class MarcarNotificacaoComoLidaRequest {
    IdNotificacao: number;

    constructor(params: Partial<MarcarNotificacaoComoLidaRequest>) {
        this.IdNotificacao = params.IdNotificacao || 0;
    }
}