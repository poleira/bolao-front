import { UsuarioResponse } from "src/app/shared/models/responses/usuario.response";

export class AutenticacaoResponse {
    usuario: UsuarioResponse | null;
    token: string;

    constructor(params: Partial<AutenticacaoResponse>) {
        this.usuario = params.usuario ?? null;
        this.token = params.token ?? '';
    }
}