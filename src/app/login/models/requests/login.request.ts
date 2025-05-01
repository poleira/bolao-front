export class LoginRequest {
    email: string;
    senha: string;
    token: string;

    constructor(params: Partial<LoginRequest>) {
        this.email = params.email ?? '';
        this.senha = params.senha ?? '';
        this.token = params.token ?? '';
    }
}