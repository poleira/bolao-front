import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface RankingItem {
  posicao: number;
  nome: string;
  pontuacao: number;
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  bolaoToken: string = '';
  jogadores: RankingItem[] = [];
  currentPage = 1;
  pageSize = 8;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.capturarToken();
    this.carregarRankingMockado();
  }

  capturarToken(): void {
    this.route.paramMap.subscribe(params => {
      this.bolaoToken = params.get('tokenAcesso') ?? '';
    });
  }

  carregarRankingMockado(): void {
    this.jogadores = Array.from({ length: 36 }).map((_, index) => ({
      posicao: index + 1,
      nome: `Jogador ${index + 1}`,
      pontuacao: 220 - index * 3
    }));
  }

  get totalPages(): number {
    return Math.ceil(this.jogadores.length / this.pageSize);
  }

  get paginaAtual(): RankingItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.jogadores.slice(start, start + this.pageSize);
  }

  navegarPalpites(nomeJogador: string): void {
    // placeholder for future navigation/logic
    console.log(`Visualizar palpites de ${nomeJogador}`);
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
