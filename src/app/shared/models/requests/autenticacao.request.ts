export class UsuarioRequest {
    email: string;
    senha: string;
    firebaseUid: string;

    constructor(params: Partial<UsuarioRequest>) {
        this.email = params.email || "";
        this.senha = params.senha || "";
        this.firebaseUid = params.firebaseUid || "";
    }
}