import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BolaoRegraResponse } from 'src/app/home/models/responses/bolao-regra.response';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';
import { BolaoService } from 'src/app/home/services/bolao.service';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnInit {

  regras!: BolaoRegraResponse[];
  bolaoToken!: string;
  @Input() esconderPontuacao: boolean = false;

  constructor(
    private route: ActivatedRoute, private bolaoService: BolaoService
  ) { }

  ngOnInit(): void {
    this.verificarParametrosRota();
    //Mock de dados para teste
    const mockRegras: BolaoRegraResponse[] = [
      { id: 1, descricao: 'Fase de Grupos', explicacao: "25", pontuacao: 25 },
      { id: 2, descricao: 'Regra #2', explicacao: "18", pontuacao: 25 },
      { id: 3, descricao: 'Regra #3', explicacao: '10', pontuacao: 25 },
      { id: 4, descricao: 'Regra #4', explicacao: "1", pontuacao: 25 },
    ];

    this.regras = mockRegras;

    this.listarRegrasBolao();
  }

  private verificarParametrosRota(): void {
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.bolaoToken = params['token'];
      }
    });
  }

  listarRegrasBolao(): void {
    this.bolaoService.listarRegrasBolao({ HashBolao: this.bolaoToken }).subscribe({
      next: (regras: BolaoRegraResponse[]) => {
        this.condicionalRegraRepetida()
        this.regras = regras;
      },
      error: (error) => {
        console.error('Erro ao listar regras do bolão:', error);
      }
    });
  }

  condicionalRegraRepetida() {
    if(this.regras.some(r => r.descricao === 'Acertou a pontuação do país na fase de grupos') && this.regras.some(r => r.descricao === 'Acertou a posição do país na fase de grupos')) {
      this.regras = this.regras.filter(r => r.descricao !== 'Acertou a pontuação do país na fase de grupos' && r.descricao !== 'Acertou a posição do país na fase de grupos');
      const novaRegra: BolaoRegraResponse = { id: 0, descricao: 'Fase de grupos', explicacao: 'Fase de grupos conforme as regras selecionadas', pontuacao: 0 };
      this.regras.push(novaRegra);
      this.esconderPontuacao = false;
    }
    else if (!this.regras.some(r => r.descricao === 'Acertou a pontuação do país na fase de grupos') && this.regras.some(r => r.descricao === 'Acertou a posição do país na fase de grupos')) {
      this.esconderPontuacao = true;
    }
  }


}