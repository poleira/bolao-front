export class UsuarioResponse {
    nome: string;
    email: string;
    firebaseUid: string;

    constructor(params: Partial<UsuarioResponse>) {
        this.nome = params.nome ?? '';
        this.email = params.email ?? '';
        this.firebaseUid = params.firebaseUid ?? '';
    }
}