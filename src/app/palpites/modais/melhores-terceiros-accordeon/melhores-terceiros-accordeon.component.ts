import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GrupoResponse } from 'src/app/shared/models/responses/grupo.response';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { gruposMock } from '../fase-de-grupo-modal/fase-de-grupo-accordion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PalpiteGrupoSelecaoResponse } from 'src/app/shared/models/responses/paplpite-grupo-selecao.response';
import { PalpiteTerceiroLugarResponse } from 'src/app/shared/models/responses/palpite-terceiro-lugar.response';
import { PalpiteTerceiroLugarRequest } from 'src/app/shared/models/requests/palpite-terceiro-lugar-request';
import { PalpiteService } from '../../palpite.service';
import { TabelaTerceiroComponent } from '../../components/tabela-terceiro/tabela-terceiro.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-melhores-terceiros-accordeon',
  templateUrl: './melhores-terceiros-accordeon.component.html',
  styleUrls: ['./melhores-terceiros-accordeon.component.css']
})
export class MelhoresTerceirosAccordeonComponent implements OnInit, OnChanges {

  titulo: string = "Terceiros Colocados";
  selecoes: SelecaoResponse[] = [];
  temTodosTerceiros: boolean = true;
  @Input() hashBolao: string = "string";
  @Input() atualizarDeFaseDeGrupo: boolean = false;
  @ViewChild(TabelaTerceiroComponent) tabelaTerceiro!: TabelaTerceiroComponent;
  @Output() emitirAtualizar = new EventEmitter<boolean>();
  @Output() emitirPalpiteTerceiroCompleto = new EventEmitter<boolean>();
  atualizar: boolean = false;
  palpitePreenchido: boolean = false;

  get selecoesTerceiros(): SelecaoResponse[] {
    return this.selecoes;
  }

  constructor(private palpiteService: PalpiteService, private toastr: ToastrService, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.recuperarTerceirosColocados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Quando atualizarDeFaseDeGrupo muda, recarrega os terceiros
    if (changes['atualizarDeFaseDeGrupo'] && !changes['atualizarDeFaseDeGrupo'].firstChange) {
      this.recuperarTerceirosColocados();
    }
  }

  recuperarTerceirosColocados() {
    this.spinner.show("palpite");
    this.palpiteService.recuperarTerceirosLugares(this.hashBolao).subscribe({
      next: (palpites: SelecaoResponse[]) => {
        this.selecoes = palpites;

        // Emite true se há 12 elementos, false caso contrário
        this.temTodosTerceiros = this.selecoes.length === 12;
        
        // Agora recupera os palpites salvos (que trazem posicao) e ordena `this.selecoes`
        this.palpiteService.recuperarPalpitesTerceirosLugares(this.hashBolao).subscribe({
          next: (palpitesSalvos: PalpiteTerceiroLugarResponse[]) => {
            if (palpitesSalvos && palpitesSalvos.length > 0) {
              this.emitirPalpiteTerceiroCompleto.emit(true);
              this.palpitePreenchido = true
              // mapa idSelecao -> posicao
              const posMap = new Map<number, number>();
              palpitesSalvos.forEach(p => posMap.set(p.selecao.id, p.posicao));

              // ordena conforme posicao; itens sem posicao conhecida ficam ao final na ordem original
              this.selecoes.sort((a, b) => {
                const pa = posMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
                const pb = posMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
                return pa - pb;
              });
            }
            this.spinner.hide("palpite");
          },
          error: (err) => {
            // se falhar ao recuperar palpites salvos, apenas continua com as selecoes recuperadas
            console.error('Erro ao recuperar palpites salvos de terceiros:', err);
            this.spinner.hide("palpite");
          }
        });
      },
      error: (error) => {
        console.error('Erro ao recuperar palpites:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao recuperar os palpites. Tente novamente.');
        this.spinner.hide("palpite");
      }
    });
  }

  salvar() {
    if (this.palpitePreenchido) {
      // Mostrar modal de confirmação
      Swal.fire({
        title: 'Atenção!',
        text: 'Ao alterar os palpites dos terceiros colocados, todos os palpites da fase eliminatória serão apagados. Deseja continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sim, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executarSalvar();
        }
      });
    } else {
      this.executarSalvar();
    }
  }

  private executarSalvar(): void {
    // Obtém a ordem exibida no app-tabela-terceiro (que pode ter sido reordenada pelo usuário)
    const ordemExibida = this.tabelaTerceiro?.selecoesExibidas || this.selecoes;

    // Monta os requests a partir da ordem exibida
    const requests: PalpiteTerceiroLugarRequest[] = ordemExibida.map((s, idx) =>
      new PalpiteTerceiroLugarRequest({ HashBolao: this.hashBolao, IdSelecao: s.id, Posicao: idx + 1 })
    );

    this.spinner.show('palpite');
    this.palpiteService.palpitarTerceiroLugar(requests).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Ordem dos melhores terceiros salva com sucesso!');
        this.spinner.hide('palpite');
        this.emitirAtualizar.emit(!this.atualizar);
        this.emitirPalpiteTerceiroCompleto.emit(this.temTodosTerceiros);
      },
      error: (error) => {
        console.error('Erro ao salvar melhores terceiros:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao salvar a ordem dos melhores terceiros. Tente novamente.');
        this.spinner.hide('palpite');
      }
    });
  }

}
