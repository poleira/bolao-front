import { Component, Input, OnInit } from '@angular/core';
import { GrupoResponse } from 'src/app/shared/models/responses/grupo.response';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { PalpiteService } from '../../palpite.service';
import { PalpiteGrupoSelecaoRequest } from 'src/app/shared/models/requests/palpite-grupo-selecao.request';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PalpiteGrupoSelecaoResponse } from 'src/app/shared/models/responses/paplpite-grupo-selecao.response';

export const gruposMock: GrupoResponse[] = [
  new GrupoResponse({ id: 1, nome: "Grupo A" }),
  new GrupoResponse({ id: 2, nome: "Grupo B" }),
  new GrupoResponse({ id: 3, nome: "Grupo C" }),
  new GrupoResponse({ id: 4, nome: "Grupo D" }),
  new GrupoResponse({ id: 5, nome: "Grupo E" }),
  new GrupoResponse({ id: 6, nome: "Grupo F" }),
  new GrupoResponse({ id: 7, nome: "Grupo G" }),
  new GrupoResponse({ id: 8, nome: "Grupo H" }),
  new GrupoResponse({ id: 9, nome: "Grupo I" }),
  new GrupoResponse({ id: 10, nome: "Grupo J" }),
  new GrupoResponse({ id: 11, nome: "Grupo K" }),
  new GrupoResponse({ id: 12, nome: "Grupo L" }),
];

// export const selecoesMock: SelecaoResponse[] = [
//   new SelecaoResponse({ id: 1, nome: "Estados Unidos", logo: "usa.png", abreviacao: "USA", grupo: gruposMock[0] }),
//   new SelecaoResponse({ id: 2, nome: "Brasil", logo: "brasil.png", abreviacao: "BRA", grupo: gruposMock[0] }),
//   new SelecaoResponse({ id: 3, nome: "Holanda", logo: "holanda.png", abreviacao: "NED", grupo: gruposMock[0] }),
//   new SelecaoResponse({ id: 4, nome: "Marrocos", logo: "marrocos.png", abreviacao: "MAR", grupo: gruposMock[0] }),

//   new SelecaoResponse({ id: 5, nome: "Argentina", logo: "argentina.png", abreviacao: "ARG", grupo: gruposMock[1] }),
//   new SelecaoResponse({ id: 6, nome: "México", logo: "mexico.png", abreviacao: "MEX", grupo: gruposMock[1] }),
//   new SelecaoResponse({ id: 7, nome: "Polônia", logo: "polonia.png", abreviacao: "POL", grupo: gruposMock[1] }),
//   new SelecaoResponse({ id: 8, nome: "Japão", logo: "japao.png", abreviacao: "JPN", grupo: gruposMock[1] }),

//   new SelecaoResponse({ id: 9, nome: "França", logo: "franca.png", abreviacao: "FRA", grupo: gruposMock[2] }),
//   new SelecaoResponse({ id: 10, nome: "Senegal", logo: "senegal.png", abreviacao: "SEN", grupo: gruposMock[2] }),
//   new SelecaoResponse({ id: 11, nome: "Austrália", logo: "australia.png", abreviacao: "AUS", grupo: gruposMock[2] }),
//   new SelecaoResponse({ id: 12, nome: "Uruguai", logo: "uruguai.png", abreviacao: "URU", grupo: gruposMock[2] }),

//   new SelecaoResponse({ id: 13, nome: "Alemanha", logo: "alemanha.png", abreviacao: "GER", grupo: gruposMock[3] }),
//   new SelecaoResponse({ id: 14, nome: "Inglaterra", logo: "inglaterra.png", abreviacao: "ENG", grupo: gruposMock[3] }),
//   new SelecaoResponse({ id: 15, nome: "Croácia", logo: "croacia.png", abreviacao: "CRO", grupo: gruposMock[3] }),
//   new SelecaoResponse({ id: 16, nome: "Coreia do Sul", logo: "coreia.png", abreviacao: "KOR", grupo: gruposMock[3] }),

//   new SelecaoResponse({ id: 17, nome: "Portugal", logo: "portugal.png", abreviacao: "POR", grupo: gruposMock[4] }),
//   new SelecaoResponse({ id: 18, nome: "Suíça", logo: "suica.png", abreviacao: "SUI", grupo: gruposMock[4] }),
//   new SelecaoResponse({ id: 19, nome: "Camarões", logo: "camaroes.png", abreviacao: "CMR", grupo: gruposMock[4] }),
//   new SelecaoResponse({ id: 20, nome: "Canadá", logo: "canada.png", abreviacao: "CAN", grupo: gruposMock[4] }),

//   new SelecaoResponse({ id: 21, nome: "Espanha", logo: "espanha.png", abreviacao: "ESP", grupo: gruposMock[5] }),
//   new SelecaoResponse({ id: 22, nome: "Itália", logo: "italia.png", abreviacao: "ITA", grupo: gruposMock[5] }),
//   new SelecaoResponse({ id: 23, nome: "Equador", logo: "equador.png", abreviacao: "ECU", grupo: gruposMock[5] }),
//   new SelecaoResponse({ id: 24, nome: "Nigéria", logo: "nigeria.png", abreviacao: "NGA", grupo: gruposMock[5] }),

//   new SelecaoResponse({ id: 25, nome: "Bélgica", logo: "belgica.png", abreviacao: "BEL", grupo: gruposMock[6] }),
//   new SelecaoResponse({ id: 26, nome: "Colômbia", logo: "colombia.png", abreviacao: "COL", grupo: gruposMock[6] }),
//   new SelecaoResponse({ id: 27, nome: "Arábia Saudita", logo: "arabia.png", abreviacao: "KSA", grupo: gruposMock[6] }),
//   new SelecaoResponse({ id: 28, nome: "Sérvia", logo: "servia.png", abreviacao: "SRB", grupo: gruposMock[6] }),

//   new SelecaoResponse({ id: 29, nome: "Turquia", logo: "turquia.png", abreviacao: "TUR", grupo: gruposMock[7] }),
//   new SelecaoResponse({ id: 30, nome: "Suécia", logo: "suecia.png", abreviacao: "SWE", grupo: gruposMock[7] }),
//   new SelecaoResponse({ id: 31, nome: "Chile", logo: "chile.png", abreviacao: "CHI", grupo: gruposMock[7] }),
//   new SelecaoResponse({ id: 32, nome: "Irã", logo: "ira.png", abreviacao: "IRN", grupo: gruposMock[7] }),
// ];

@Component({
  selector: 'app-fase-de-grupo-accordion',
  templateUrl: './fase-de-grupo-accordion.component.html',
  styleUrls: ['./fase-de-grupo-accordion.component.css']
})
export class FaseDeGrupoAccordionComponent implements OnInit {

  @Input() titulo: string = "Fase de Grupos"
  selecoes: SelecaoResponse[] = []
  grupos: GrupoResponse[] = gruposMock
  @Input() esconderPontuacao: boolean = false;
  @Input() hashBolao: string = "string";

  constructor(private palpiteService: PalpiteService, private toastr: ToastrService, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.listarSelecoes();
    this.recuperarPalpites();
  }

  getSelecoesPorGrupo(grupoId: number) {
    return this.selecoes.filter(s => s.grupo?.id === grupoId);
  }

  listarSelecoes(){
    this.spinner.show("palpite");
    this.palpiteService.listarSelecoes().subscribe({
      next: (selecoes: SelecaoResponse[]) => {
        this.selecoes = selecoes;
        console.log(this.selecoes);
        this.spinner.hide("palpite");
      },
      error: (error) => {
        console.error('Erro ao listar seleções:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao listar as seleções. Tente novamente.');
        this.spinner.hide("palpite");
      }
    });
  }

  recuperarPalpites(){
    this.spinner.show("palpite");
    this.palpiteService.recuperarPalpiteGrupoSelecao(this.hashBolao).subscribe({
      next: (palpites: PalpiteGrupoSelecaoResponse[]) => {
        this.selecoes.forEach((selecao:SelecaoResponse) => {
          const palpite = palpites.find(p => p.selecao.id === selecao.id);
          if (palpite) {
            if (palpite.pontuacaoSelecao) {
              selecao.pontuacaoSelecao = palpite.pontuacaoSelecao;
            }
            selecao.posicaoSelecaoFaseDeGrupos = palpite.posicaoSelecao;
          }
        });
        this.spinner.hide("palpite");
      },
      error: (error) => {
        console.error('Erro ao recuperar palpites:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao recuperar os palpites. Tente novamente.');
        this.spinner.hide("palpite");
      }
    });
  }

  salvar() {
    let palpiteGrupoSelecao: PalpiteGrupoSelecaoRequest[] = [];

    for (let selecao of this.selecoes) {
      palpiteGrupoSelecao.push(new PalpiteGrupoSelecaoRequest({
        HashBolao: this.hashBolao,
        IdGrupo: selecao.grupo?.id || 0,
        IdSelecao: selecao.id,
        PontuacaoSelecao: selecao.pontuacaoSelecao,
        PosicaoSelecao: selecao.posicaoSelecaoFaseDeGrupos
      }));
    }

    this.spinner.show("palpite");
    this.palpiteService.palpitarGrupoSelecao(palpiteGrupoSelecao).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite fase de grupos salvo com sucesso.');
        this.spinner.hide("palpite");
      },
      error: (error) => {
        console.error("Erro ao salvar palpites:", error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao salvar o palpite. Tente novamente.');
        this.spinner.hide("palpite");
      }
    });
  }

}
