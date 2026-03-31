export class UsuarioResponse {
    id: number;
    nome: string;
    email: string;
    firebaseUid: string;

    constructor(params: Partial<UsuarioResponse>) {
        this.id = params.id ?? 0;
        this.nome = params.nome ?? '';
        this.email = params.email ?? '';
        this.firebaseUid = params.firebaseUid ?? '';
    }
}