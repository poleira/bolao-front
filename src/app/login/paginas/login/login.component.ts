import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private auth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
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

    this.authService.login(loginRequest).subscribe({
      next: (response: AutenticacaoResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
        this.authService.authStatus.next(true);
        this.toastr.success('Login realizado com sucesso!', 'Sucesso');

        this.loginForm.reset();
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: error => {
        this.isSubmitting = false;
        this.toastr.error('Erro ao buscar usuário no backend.', 'Erro');
      }
    });
  }

  async autenticarFirebase(loginRequest: LoginRequest) {
    const firebaseUser = await this.auth.signInWithEmailAndPassword(
      loginRequest.email,
      loginRequest.senha
    ).catch((error) => {
      this.handleFirebaseAuthError(error);
    });;

    return firebaseUser;
  }

  private handleFirebaseAuthError(error: any) {
    let errorMessage = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';

    // Use correct error checking for Firebase authentication errors
    if (error && error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Formato de email inválido.';
          break;
        case 'auth/invalid-login-credentials':
          errorMessage = 'Email ou senha incorretos.';
          break;
      }
    }

    this.toastr.error(errorMessage, 'Erro de Autenticação');
  }
}