export class UsuarioResponse {
    id: number | null;
    nome: string;
    email: string;
    firebaseUid: string;

    constructor(params: Partial<UsuarioResponse>) {
        this.id = params.id ?? null;
        this.nome = params.nome ?? '';
        this.email = params.email ?? '';
        this.firebaseUid = params.firebaseUid ?? '';
    }
}