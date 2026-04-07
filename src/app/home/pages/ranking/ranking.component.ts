import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RankService } from 'src/app/home/services/rank.service';
import { RankResponse } from 'src/app/home/models/responses/rank.response';
import { HashBolaoRequest } from 'src/app/shared/models/requests/hash-bolao.request';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { ToastrService } from 'ngx-toastr';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  bolaoToken: string = '';
  jogadores: RankResponse[] = [];
  currentPage = 1;
  pageSize = 8;
  modalAberto = false;
  usuarioSelecionado = '';
  usuarioEhAdmin = false;
  nomeUsuarioLogado = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rankService: RankService,
    private bolaoService: BolaoService,
    private boloesUsuariosService: BoloesUsuariosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.boloesUsuariosService.getAdminState().subscribe(state => {
      this.usuarioEhAdmin = state.usuarioEhAdmin;
      this.nomeUsuarioLogado = state.nomeUsuarioLogado;
    });
    this.capturarToken();
  }

  capturarToken(): void {
    this.route.paramMap.subscribe(params => {
      const encodedToken = params.get('tokenAcesso') ?? '';
      this.bolaoToken = encodedToken ? decodeURIComponent(encodedToken) : '';
      if (this.bolaoToken) {
        this.carregarRanking();
      }
    });
  }

  carregarRanking(): void {
    const request = new HashBolaoRequest({ HashBolao: this.bolaoToken });

    this.rankService.listar(request)
      .subscribe({
        next: (dados: RankResponse[]) => {
          this.jogadores = dados ?? [];
          this.currentPage = 1;
        },
        error: () => {
          this.jogadores = [];
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.jogadores.length / this.pageSize);
  }

  get paginaAtual(): RankResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.jogadores.slice(start, start + this.pageSize);
  }

  navegarPalpites(nomeJogador: string): void {
    this.usuarioSelecionado = nomeJogador;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.usuarioSelecionado = '';
  }

  alterarPagina(delta: number): void {
    const novaPagina = this.currentPage + delta;

    if (novaPagina < 1 || novaPagina > this.totalPages) {
      return;
    }

    this.currentPage = novaPagina;
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  excluirJogador(jogador: RankResponse): void {
    Swal.fire({
      title: 'Remover jogador?',
      text: `Tem certeza que deseja remover "${jogador.usuario}" do bolão?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const request = new AssociarUsuarioRequest({
          HashBolao: this.bolaoToken,
          IdUsuarioASerAlterado: jogador.idUsuario
        });
        this.bolaoService.desassociarUsuarioBolao(request)
          .subscribe({
            next: () => {
              this.toastr.success(`"${jogador.usuario}" foi removido do bolão.`, 'Sucesso');
              this.carregarRanking();
            },
            error: (error) => {
              this.toastr.error(error.error?.erro || 'Erro ao remover jogador.', 'Erro');
            }
          });
      }
    });
  }
}
