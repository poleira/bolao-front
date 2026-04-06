import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { JogosService } from '../../jogos.service';
import { JogoGrupoResponse } from 'src/app/shared/models/responses/jogo-grupo.response';
import { PalpiteService } from '../../palpite.service';
import { PalpiteJogoGrupoRequest } from 'src/app/shared/models/requests/palpite-jogo-grupo.request';
import { PalpiteJogoGrupoResponse } from 'src/app/shared/models/responses/palpite-jogo-grupo.response';

export interface JogoBr {
  id: number;
  timeA: SelecaoResponse;
  timeB: SelecaoResponse;
  palpiteA: number | null;
  palpiteB: number | null;
}

export interface GrupoBr {
  idGrupo: number;
  nome: string;
  jogos: JogoBr[];
}

@Component({
  selector: 'app-jogos-br-accordion',
  templateUrl: './jogos-br-accordion.component.html',
  styleUrls: ['./jogos-br-accordion.component.css']
})
export class JogosBrAccordionComponent implements OnInit {

  @Input() hashBolao: string = 'string';

  grupos: GrupoBr[] = [];

  constructor(
    private jogosService: JogosService,
    private palpiteService: PalpiteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.carregarJogosBrasil();
  }

  carregarJogosBrasil(): void {
    this.spinner.show('jogos-br');
    this.jogosService.listarJogosBrasil().subscribe({
      next: (jogos: JogoGrupoResponse[]) => {
        this.grupos = this.agruparPorGrupo(jogos);
        this.spinner.hide('jogos-br');
        this.recuperarPalpites();
      },
      error: (error) => {
        console.error('Erro ao carregar jogos do Brasil:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao carregar os jogos. Tente novamente.');
        this.spinner.hide('jogos-br');
      }
    });
  }

  private agruparPorGrupo(jogos: JogoGrupoResponse[]): GrupoBr[] {
    const mapa = new Map<string, GrupoBr>();

    jogos.forEach(jogo => {
      if (!jogo.selecao1 || !jogo.selecao2) return;

      const nomeGrupo = jogo.grupo?.nome ?? 'Sem grupo';

      if (!mapa.has(nomeGrupo)) {
        mapa.set(nomeGrupo, { idGrupo: jogo.grupo?.id ?? 0, nome: nomeGrupo, jogos: [] });
      }

      mapa.get(nomeGrupo)!.jogos.push({
        id: jogo.id,
        timeA: jogo.selecao1,
        timeB: jogo.selecao2,
        palpiteA: null,
        palpiteB: null,
      });
    });

    return Array.from(mapa.values());
  }

  recuperarPalpites(): void {
    this.spinner.show('jogos-br');
    this.palpiteService.recuperarPalpiteJogoGrupo(this.hashBolao).subscribe({
      next: (palpites: PalpiteJogoGrupoResponse[]) => {
        this.preencherPalpites(palpites);
        this.spinner.hide('jogos-br');
      },
      error: (error) => {
        console.error('Erro ao recuperar palpites dos jogos:', error);
        this.toastr.error('Erro ao recuperar os palpites. Tente novamente.', 'Erro');
        this.spinner.hide('jogos-br');
      }
    });
  }

  private preencherPalpites(palpites: PalpiteJogoGrupoResponse[]): void {
    for (const grupo of this.grupos) {
      for (const jogo of grupo.jogos) {
        const palpite = palpites.find(
          p => p.selecao1.id === jogo.timeA.id && p.selecao2.id === jogo.timeB.id
        );
        if (palpite) {
          jogo.palpiteA = palpite.placarSelecao1;
          jogo.palpiteB = palpite.placarSelecao2;
        }
      }
    }
  }

  salvarPalpites(): void {
    const requests: PalpiteJogoGrupoRequest[] = [];

    for (const grupo of this.grupos) {
      for (const jogo of grupo.jogos) {
        if (jogo.palpiteA === null || jogo.palpiteB === null) continue;

        requests.push(new PalpiteJogoGrupoRequest({
          HashBolao: this.hashBolao,
          IdGrupo: grupo.idGrupo,
          IdSelecao1: jogo.timeA.id,
          IdSelecao2: jogo.timeB.id,
          PlacarSelecao1: jogo.palpiteA,
          PlacarSelecao2: jogo.palpiteB,
        }));
      }
    }

    if (requests.length === 0) {
      this.toastr.warning('Preencha ao menos um palpite antes de salvar.', 'Atenção');
      return;
    }

    this.spinner.show('jogos-br');
    this.palpiteService.palpitarJogosGrupos(requests).subscribe({
      next: () => {
        this.toastr.success('Palpites salvos com sucesso!', 'Sucesso');
        this.spinner.hide('jogos-br');
      },
      error: (error) => {
        console.error('Erro ao salvar palpites:', error);
        this.toastr.error('Erro!', error.error?.erro || 'Ocorreu um erro ao salvar os palpites. Tente novamente.');
        this.spinner.hide('jogos-br');
      }
    });
  }
}
