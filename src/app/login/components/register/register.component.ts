import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';

import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { VerificarUsuarioExistenteRequest } from 'src/app/shared/models/requests/verificar-usuario-existente.request';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  formCadastrar!: FormGroup;
  bolaoToken: string | null = null;
  bolaoSenha: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private bolaoService: BolaoService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarParametrosRota();
  }

  inicializarFormulario() {
    this.formCadastrar = this.formBuilder.group({
      Nome: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Senha: ['', Validators.required]
    });
  }

  async cadastrar() {
    const usuarioRequest: UsuarioRequest = { ...this.formCadastrar.value };
    
    const verificarRequest = new VerificarUsuarioExistenteRequest({
      Nome: usuarioRequest.Nome,
      Email: usuarioRequest.Email
    });

    this.usuarioService.verificarUsuarioExistente(verificarRequest)
      .subscribe({
        next: async () => {
          try {
            const firebaseUser = await this.auth.createUserWithEmailAndPassword(
              usuarioRequest.Email,
              usuarioRequest.Senha
            );

            usuarioRequest.FirebaseUid = firebaseUser.user?.uid ?? '';

            this.authService.inserir(usuarioRequest)
              .subscribe({
                next: async () => {
                  this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
                  this.formCadastrar.reset();
                  await this.autoLogin(usuarioRequest);
                },
                error: error => {
                  this.toastr.error('Erro ao salvar usuário no backend.', 'Erro');
                }
              });
          } catch (firebaseError: any) {
            this.toastr.error(firebaseError.message || 'Erro ao criar usuário no Firebase.', 'Erro');
          }
        },
        error: (error) => {
          this.toastr.error(error.error?.erro || 'Usuário já existe no sistema.', 'Erro');
        }
      });
  }

  private verificarParametrosRota(): void {
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.bolaoToken = params['token'];
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['senha']) {
        this.bolaoSenha = params['senha'];
      }
    });
  }

  private async autoLogin(usuarioRequest: UsuarioRequest): Promise<void> {
    try {
      const firebaseUserCredential = await this.auth.signInWithEmailAndPassword(
        usuarioRequest.Email,
        usuarioRequest.Senha
      );

      if (!firebaseUserCredential || !firebaseUserCredential.user) {
        this.router.navigate(['/login']);
        return;
      }

      const firebaseToken = await firebaseUserCredential.user.getIdToken();
      const decodedToken = await firebaseUserCredential.user.getIdTokenResult();
      const expirationTimeEpoch = new Date(decodedToken.expirationTime).getTime();

      const loginRequest = new LoginRequest({
        email: usuarioRequest.Email,
        senha: usuarioRequest.Senha,
        token: firebaseToken ?? ''
      });

      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.authService.completeFirebaseSession(expirationTimeEpoch);

          if (this.bolaoToken) {
            this.associarUsuarioBolao();
          } else {
            this.router.navigate(['/hub-boloes']);
          }
        },
        error: () => {
          this.toastr.error('Conta criada, mas erro ao fazer login automático. Faça login manualmente.', 'Aviso');
          this.router.navigate(['/login']);
        }
      });
    } catch {
      this.toastr.error('Conta criada, mas erro ao fazer login automático. Faça login manualmente.', 'Aviso');
      this.router.navigate(['/login']);
    }
  }

  private associarUsuarioBolao(): void {
    if (!this.bolaoToken) return;

    const request = new AssociarUsuarioRequest({
      HashBolao: this.bolaoToken,
      Senha: this.bolaoSenha || ''
    });

    this.bolaoService.associarUsuarioBolao(request).subscribe({
      next: () => {
        this.toastr.success('Usuário associado ao bolão com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (e) => {
        this.toastr.error(e.error?.erro || 'Erro ao associar usuário ao bolão.', 'Erro');
        this.router.navigate(['/home']);
      }
    });
  }

  voltar() {
    this.router.navigate(['/convidados', this.bolaoToken]);
  }
}
