import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GrupoResponse } from 'src/app/shared/models/responses/grupo.response';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { PalpiteService } from '../../palpite.service';
import { PalpiteGrupoSelecaoRequest } from 'src/app/shared/models/requests/palpite-grupo-selecao.request';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { PalpiteGrupoSelecaoResponse } from 'src/app/shared/models/responses/paplpite-grupo-selecao.response';
import Swal from 'sweetalert2';

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

@Component({
  selector: 'app-fase-de-grupo-accordion',
  templateUrl: './fase-de-grupo-accordion.component.html',
  styleUrls: ['./fase-de-grupo-accordion.component.css']
})
export class FaseDeGrupoAccordionComponent implements OnInit {

  selecoes: SelecaoResponse[] = []
  grupos: GrupoResponse[] = gruposMock
  @Input() esconderPontuacao: boolean = false;
  @Input() hashBolao: string = "string";
  @Output() emitirAtualizar = new EventEmitter<boolean>();
  @Output() emitirPalpiteGrupoCompleto = new EventEmitter<boolean>();
  atualizar: boolean = false;
  palpitePreenchido: boolean = false;

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
        if(palpites.length > 0) {
          this.palpitePreenchido = true
        }
        this.selecoes.forEach((selecao:SelecaoResponse) => {
          const palpite = palpites.find(p => p.selecao.id === selecao.id);
          if (palpite) {
            if (palpite.pontuacaoSelecao) {
              selecao.pontuacaoSelecao = palpite.pontuacaoSelecao;
            }
            selecao.posicaoSelecaoFaseDeGrupos = palpite.posicaoSelecao;
          }
        });
        
        // Verifica se o palpite está completo (48 seleções com posição preenchida)
        const palpitesCompletos = this.selecoes.filter(s => s.posicaoSelecaoFaseDeGrupos > 0).length;
        this.emitirPalpiteGrupoCompleto.emit(palpitesCompletos === 48);
        
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

    if(this.palpitePreenchido) {
      // Mostrar modal de confirmação
      Swal.fire({
        title: 'Atenção!',
        text: 'Ao alterar os palpites da fase de grupos, todos os palpites da fase eliminatória e dos terceiros colocados serão apagados (caso preenchidos). Deseja continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executarSalvar(palpiteGrupoSelecao);
        }
      });
    } else {
      this.executarSalvar(palpiteGrupoSelecao);
    }
  }

  private executarSalvar(palpiteGrupoSelecao: PalpiteGrupoSelecaoRequest[]): void {
    this.spinner.show("palpite");
    this.palpiteService.palpitarGrupoSelecao(palpiteGrupoSelecao).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite fase de grupos salvo com sucesso.');
        this.spinner.hide("palpite");
        
        // Verifica se o palpite está completo (48 seleções com posição preenchida)
        const palpitesCompletos = palpiteGrupoSelecao.filter(p => p.PosicaoSelecao > 0).length;
        this.emitirPalpiteGrupoCompleto.emit(palpitesCompletos === 48);
        
        this.emitirAtualizar.emit(!this.atualizar); 
      },
      error: (error) => {
        console.error("Erro ao salvar palpites:", error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao salvar o palpite. Tente novamente.');
        this.spinner.hide("palpite");
      }
    });
  }

}
