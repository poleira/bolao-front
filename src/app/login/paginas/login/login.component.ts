import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private auth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.construirFormulario();
  }

  private construirFormulario(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  async autenticar() {
    const loginRequest: LoginRequest = { ...this.loginForm.value };

    const firebaseUser = await this.autenticarFirebase(loginRequest);
    const token = await firebaseUser?.user?.getIdToken();
    loginRequest.token = token ?? '';

    this.spinner.show('loadLogin');

    this.authService.login(loginRequest)
      .pipe(finalize(() => this.spinner.hide('loadLogin')))
      .subscribe({
        next: (response: AutenticacaoResponse) => {
          this.atualizaLocalSotorage(response);
          this.authService.authStatus.next(true);
          this.toastr.success('Login realizado com sucesso!', 'Sucesso');

          this.loginForm.reset();
          this.router.navigate(['/home']);
        },
        error: error => {
          this.toastr.error('Erro ao buscar usuário no backend.', 'Erro');
        }
      });
  }

  atualizaLocalSotorage(response: AutenticacaoResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
  }

  async autenticarFirebase(loginRequest: LoginRequest) {
    const firebaseUsuario = await this.auth.signInWithEmailAndPassword(
      loginRequest.email,
      loginRequest.senha
    ).catch((error) => {
      this.exibirErroDeAutenticacaoFirebase(error);
    });;

    return firebaseUsuario;
  }

  private exibirErroDeAutenticacaoFirebase(error: any) {
    let mensagemDeErro = '';

    if (error && error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          mensagemDeErro = 'Formato de email inválido.';
          break;
        case 'auth/invalid-login-credentials':
          mensagemDeErro = 'Email ou senha incorretos.';
          break;
        default:
          mensagemDeErro = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
          break;
      }
    }

    this.toastr.error(mensagemDeErro, 'Erro de Autenticação');
  }
}