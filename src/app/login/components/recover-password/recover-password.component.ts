import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent implements OnInit {

  recuperarSenhaForm!: FormGroup;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}
  
  ngOnInit(): void {
    this.recuperarSenhaForm = this.formBuilder.group({ email: [''] });
  }

  enviar() {
    const email = this.recuperarSenhaForm.get('email')?.value;
    this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.toastr.success('Um link de recuperação de senha foi enviado para seu email.');
        this.router.navigate(['']);
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          this.toastr.warning('Não há usuário cadastrado com este email.');
        } else if (error.code === 'auth/invalid-email') {
          this.toastr.warning('E-mail inválido');
        } else {
          this.toastr.error('Ocorreu um erro ao enviar o email de recuperação. Por favor, tente novamente.');
        }
      });
  }
}
