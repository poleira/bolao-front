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
import firebase from 'firebase/compat/app';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

    loginForm!: FormGroup;

    constructor(
        private afAuth: AngularFireAuth,
        private fb: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private spinner: NgxSpinnerService) {

    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
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
                        this.toastr.success('Login realizado com sucesso!', 'Sucesso');
                        this.loginForm.reset();
                        this.router.navigate(['/home']);
                    },
                    error: error => {
                        console.error('Backend login error:', error);
                        this.toastr.error(error?.error?.message || 'Erro ao autenticar com o backend.', 'Erro no Backend');
                        this.authService.logout(false); // Clear any partial session data without redirect
                    }
                });

        } catch (firebaseError) {
            // This catch is for errors during Firebase auth that weren't caught inside autenticarFirebase
            // or if autenticarFirebase re-throws.
            this.spinner.hide('loadLogin');
            console.error('General Firebase authentication error:', firebaseError);
            // Error message should have been displayed by exibirErroDeAutenticacaoFirebase
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
            // Do not hide spinner here, it's handled in the caller
            return undefined; // Indicate failure
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
                case 'auth/wrong-password': // Older SDKs
                case 'auth/invalid-credential': // Newer SDKs for wrong email/password
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
}
