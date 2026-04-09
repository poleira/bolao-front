import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModoJogoResponse } from 'src/app/home/models/responses/bolao-modo-jogo.response';
import { BolaoRegraResponse } from 'src/app/home/models/responses/bolao-regra.response';
import { BolaoService } from 'src/app/home/services/bolao.service';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnInit {

  regras: BolaoRegraResponse[] = [];
  bolaoToken!: string;
  modoJogo: ModoJogoResponse | null = null;
  faseGrupoAtualizada: boolean = false;
  terceiroAtualizado: boolean = false;
  palpiteGrupoCompleto: boolean = false;
  palpiteTerceiroCompleto: boolean = false;
  @Input() esconderPontuacao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bolaoService: BolaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.verificarParametrosRota();
    this.listarRegrasBolao();
    this.recuperarModoJogo();
  }

  private verificarParametrosRota(): void {
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.bolaoToken = params['token'];
      }
    });
  }

  recuperarModoJogo(): void {
    this.bolaoService.recuperarModoJogo(this.bolaoToken).subscribe({
      next: (modoJogo: ModoJogoResponse) => {
        this.modoJogo = modoJogo;
      },
      error: (error) => {
        console.error('Erro ao recuperar modo de jogo:', error);
      }
    });
  }

  listarRegrasBolao(): void {
    this.bolaoService.listarRegrasBolao({ HashBolao: this.bolaoToken }).subscribe({
      next: (regras: BolaoRegraResponse[]) => {
        this.regras = regras;
        this.condicionalRegraRepetida()
      },
      error: (error) => {
        console.error('Erro ao listar regras do bolão:', error);
      }
    });
  }

  condicionalRegraRepetida() {
    if(this.regras.some(r => r.descricao === 'Acertou a pontuação do país na fase de grupos')) {
      this.esconderPontuacao = false;
    }
    else {
      this.esconderPontuacao = true;
    }
  }

  get regrasDescricoes(): string[] {
    return this.regras.map(r => r.descricao);
  }

  contemRegra(descricao: string): boolean {
    return this.regras.some(r => r.descricao === descricao);
  }

  verRegras(): void {
    if (!this.bolaoToken) {
      return;
    }

    this.router.navigate(['/regras', this.bolaoToken]);
  }

}