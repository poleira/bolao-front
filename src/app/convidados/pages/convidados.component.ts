import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  usuarioLogado: UsuarioResponse = new UsuarioResponse({});

  private destroyed$ = new Subject<void>();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private bolaoService: BolaoService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isUserAuthenticatedSync()) {
      this.carregarUsuarioLogado();
    }
  }

  carregarUsuarioLogado(): void {
    this.usuarioService.obterUsuarioLogado()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (usuario: UsuarioResponse) => {
          this.usuarioLogado = usuario;
        },
        error: () => {
          this.usuarioLogado = new UsuarioResponse({});
        }
      });
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

    const usuarioLogado: UsuarioResponse = this.recuperarUsuarioLogado();
  
    if (usuarioLogado.email !== "") {
      this.bolaoService.associarUsuarioBolao(this.request)
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe({
          next: () => {
            this.toastr.success('Usuário associado ao bolão com sucesso!');
            this.router.navigate(['/home']);
          },
          error: (e) => {
            this.toastr.error(e.error.erro || 'Erro ao associar usuário ao bolão. Verifique o token e a senha.', 'Erro');
          }
        });
    } else {
      this.router.navigate(['/convidados', this.token], { 
        queryParams: this.possuiSenha ? { senha: this.senha } : {} 
      });

      this.toastr.info('Por favor, faça login ou cadastre-se para associar-se ao bolão.');
    }
  }

  recuperarUsuarioLogado(): UsuarioResponse {
    return this.usuarioLogado;
  }
}
