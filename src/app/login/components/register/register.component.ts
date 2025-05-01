import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  formCadastrar!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
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

    const firebaseUser = await this.auth.createUserWithEmailAndPassword(
      usuarioRequest.Email,
      usuarioRequest.Senha
    );

    usuarioRequest.FirebaseUid = firebaseUser.user?.uid ?? '';

    this.authService.inserir(usuarioRequest).subscribe({
      next: response => {
        this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
        this.formCadastrar.reset();
      },
      error: error => {
        this.toastr.error('Erro ao salvar usuário no backend.', 'Erro');
      }
    });
  }
}
