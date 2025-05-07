import { UsuarioResponse } from "src/app/shared/models/responses/usuario.response";
import { BolaoResponse } from "./bolao.response";

export class BolaoUsuarioResponse {
    bolao: BolaoResponse | null;
    usuario: UsuarioResponse | null;

    constructor(params: Partial<BolaoUsuarioResponse>) {
        this.bolao = params.bolao ?? null;
        this.usuario = params.usuario ?? null;
    }
}