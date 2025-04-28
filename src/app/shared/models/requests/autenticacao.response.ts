
export class AutenticacaoResponse {
    id: number
    email: string;
    senha: string;
    firebaseUid: string;

    constructor(params: Partial<AutenticacaoResponse>) {
        this.id = params.id || 0;
        this.email = params.email || "";
        this.senha = params.senha || "";
        this.firebaseUid = params.firebaseUid || "";
    }
}