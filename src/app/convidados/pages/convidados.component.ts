import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';

@Component({
  selector: 'app-convidados',
  templateUrl: './convidados.component.html',
  styleUrls: ['./convidados.component.css']
})
export class ConvidadosComponent implements OnInit, OnDestroy {

  token: string = '';
  senha: string = '';

  possuiSenha: boolean = true;
  mostrarSenha: boolean = false;

  request: AssociarUsuarioRequest = new AssociarUsuarioRequest({});

  private destroyed$ = new Subject<void>();

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private bolaoService: BolaoService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }

  togglePossuiSenha(): void {
    if (!this.possuiSenha) {
      this.senha = '';
      this.mostrarSenha = false;
    }
  }

  toggleSenhaVisibilidade(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  associarUsuario(): void {
    this.request.HashBolao = this.token;
    this.request.Senha = this.senha;

    this.spinner.show();

    const usuarioLogado: UsuarioResponse = this.recuperarUsuarioLogado();
    if (usuarioLogado.firebaseUid.length > 0) {
      this.request.HasUsuarioLogado = usuarioLogado.firebaseUid;
      this.bolaoService.associarUsuarioBolao(this.request)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => this.spinner.hide())
        )
        .subscribe({
          next: () => {
            this.toastr.success('Usuário associado ao bolão com sucesso!');
            this.router.navigate(['/home']);
          },
          error: () => {
            this.toastr.error('Erro ao associar usuário ao bolão. Verifique o token e a senha.');
          }
        });
    } else {
      this.router.navigate(['/convidados', this.token], { 
        queryParams: this.possuiSenha ? { senha: this.senha } : {} 
      });

      this.spinner.hide();
      this.toastr.info('Por favor, faça login para associar-se ao bolão.');
    }
  }

  recuperarUsuarioLogado(): UsuarioResponse {
    const authUser = sessionStorage.getItem('auth-user');

    let usuario: UsuarioResponse = new UsuarioResponse({});

    if (authUser) {
      const objeto = JSON.parse(authUser);
      usuario = objeto.usuario;
    }

    return usuario;
  }
}
