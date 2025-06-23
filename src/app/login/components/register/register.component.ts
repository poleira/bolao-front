import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  formCadastrar!: FormGroup;
  bolaoToken: string | null = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
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
    
    this.spinner.show("loadCadastroUsuario");
    
    const firebaseUser = await this.auth.createUserWithEmailAndPassword(
      usuarioRequest.Email,
      usuarioRequest.Senha
    );

    usuarioRequest.FirebaseUid = firebaseUser.user?.uid ?? '';

    this.authService.inserir(usuarioRequest)
      .pipe(finalize(() => this.spinner.hide("loadCadastroUsuario")))
      .subscribe({
        next: response => {
          this.toastr.success('Usuário criado com sucesso!', 'Sucesso');
          this.formCadastrar.reset();
          this.router.navigate(['/login']);
        },
        error: error => {
          this.toastr.error('Erro ao salvar usuário no backend.', 'Erro');
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
