import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RankService } from 'src/app/home/services/rank.service';
import { RankResponse } from 'src/app/home/models/responses/rank.response';
import { HashBolaoRequest } from 'src/app/shared/models/requests/hash-bolao.request';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rankService: RankService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
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
    this.spinner.show('carregando');

    this.rankService.listar(request)
      .pipe(finalize(() => this.spinner.hide('carregando')))
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
}
