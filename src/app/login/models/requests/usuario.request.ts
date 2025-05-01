export class UsuarioRequest {
    Nome: string;
    Email: string;
    Senha: string;
    FirebaseUid: string;

    constructor(params: Partial<UsuarioRequest>) {
        this.Nome = params.Nome ?? '';
        this.Email = params.Email ?? '';
        this.Senha = params.Senha ?? '';
        this.FirebaseUid = params.FirebaseUid ?? '';
    }
}