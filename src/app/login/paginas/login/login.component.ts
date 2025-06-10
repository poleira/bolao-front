import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import firebase from 'firebase/compat/app';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  bolaoToken: string | null = null;
  bolaoSenha: string | null = null;

  constructor(
    private afAuth: AngularFireAuth, // Renamed for clarity
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private bolaoService: BolaoService
  ) { }

  ngOnInit(): void {
    this.construirFormulario();
    this.verificarParametrosRota();
  }

  private verificarParametrosRota(): void {
    // Check if we have a token parameter in the route
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.bolaoToken = params['token'];
      }
    });

    // Check if we have a senha parameter in the query params
    this.route.queryParams.subscribe(params => {
      if (params['senha']) {
        this.bolaoSenha = params['senha'];
      }
    });
  }

  private construirFormulario(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  async autenticar() {
    if (this.loginForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos corretamente.', 'Formulário Inválido');
      return;
    }

    const loginRequest: LoginRequest = { ...this.loginForm.value };
    this.spinner.show('loadLogin');

    try {
      const firebaseUserCredential = await this.autenticarFirebase(loginRequest);

      if (!firebaseUserCredential || !firebaseUserCredential.user) {
        this.spinner.hide('loadLogin');
        return;
      }

      const firebaseToken = await firebaseUserCredential.user.getIdToken();
      const decodedToken = await firebaseUserCredential.user.getIdTokenResult();

      const expirationTimeEpoch = new Date(decodedToken.expirationTime).getTime();

      loginRequest.token = firebaseToken ?? '';

      this.authService.login(loginRequest)
        .pipe(finalize(() => this.spinner.hide('loadLogin')))
        .subscribe({
          next: (response: AutenticacaoResponse) => {
            this.authService.completeFirebaseSession(expirationTimeEpoch);
            this.loginForm.reset();

            // Check if we need to associate user with a bolão
            if (this.bolaoToken) {
              this.associarUsuarioBolao();
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: error => {
            this.toastr.error(error?.error?.message || 'Erro ao autenticar com o backend.', 'Erro no Backend');
            this.authService.logout(false);
          }
        });

    } catch (firebaseError) {
      this.spinner.hide('loadLogin');
    }
  }

  async autenticarFirebase(loginRequest: LoginRequest): Promise<firebase.auth.UserCredential | undefined> {
    try {
      const firebaseUserCredential = await this.afAuth.signInWithEmailAndPassword(
        loginRequest.email,
        loginRequest.senha
      );
      return firebaseUserCredential;
    } catch (error: any) {
      this.exibirErroDeAutenticacaoFirebase(error);
      return undefined;
    }
  }

  private exibirErroDeAutenticacaoFirebase(error: any) {
    let mensagemDeErro = 'Ocorreu um erro desconhecido durante a autenticação com o Firebase.';
    if (error && error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          mensagemDeErro = 'Formato de email inválido.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          mensagemDeErro = 'Email ou senha incorretos.';
          break;
        case 'auth/too-many-requests':
          mensagemDeErro = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        default:
          mensagemDeErro = 'Ocorreu um erro ao tentar fazer login com o Firebase. Tente novamente.';
          console.error("Firebase Auth Error Code:", error.code, error.message);
          break;
      }
    } else {
      console.error("Unknown Firebase Auth Error:", error);
    }

    this.toastr.error(mensagemDeErro, 'Erro de Autenticação');
  }

  private associarUsuarioBolao(): void {
    if (!this.bolaoToken) return;

    this.spinner.show('loadAssociacao');

    const request = new AssociarUsuarioRequest({
      HashBolao: this.bolaoToken,
      Senha: this.bolaoSenha || ''
    });

    this.bolaoService.associarUsuarioBolao(request)
      .pipe(finalize(() => this.spinner.hide('loadAssociacao')))
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (e) => {
          this.toastr.error(e.error.erro || 'Erro ao associar usuário ao bolão. Verifique o token e a senha.', 'Erro');
          this.router.navigate(['/home']);
        }
      });
  }
}