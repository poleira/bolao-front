import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';

import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { VerificarUsuarioExistenteRequest } from 'src/app/shared/models/requests/verificar-usuario-existente.request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  formCadastrar!: FormGroup;
  bolaoToken: string | null = null;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
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
                next: response => {
                  this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
                  sessionStorage.setItem('novo-cadastro', 'true');
                  this.formCadastrar.reset();
                  this.router.navigate(['/login']);
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
  }

  voltar() {
    this.router.navigate(['/convidados', this.bolaoToken]);
  }
}
