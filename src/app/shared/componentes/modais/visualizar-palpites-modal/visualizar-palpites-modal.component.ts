import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PalpiteService } from 'src/app/palpites/palpite.service';
import { PalpitesPorEscritoResponse } from 'src/app/shared/models/responses/palpites-por-escrito.response';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-visualizar-palpites-modal',
  templateUrl: './visualizar-palpites-modal.component.html',
  styleUrls: ['./visualizar-palpites-modal.component.css']
})
export class VisualizarPalpitesModalComponent implements OnInit {

  @Input() nomeUsuario: string = '';
  @Input() hashBolao: string = '';
  @Output() fecharModal = new EventEmitter<void>();
  
  palpites?: PalpitesPorEscritoResponse;

  constructor(
    private palpiteService: PalpiteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.carregarPalpites();
  }

  carregarPalpites(): void {
    this.spinner.show('carregando-palpites');
    
    this.palpiteService.obterPalpitesPorEscrito(this.nomeUsuario, this.hashBolao)
      .pipe(finalize(() => this.spinner.hide('carregando-palpites')))
      .subscribe({
        next: (dados: PalpitesPorEscritoResponse) => {
          this.palpites = dados;
        },
        error: (error) => {
          this.toastr.error(error.error?.erro || 'Erro ao carregar palpites.', 'Erro');
          this.fechar();
        }
      });
  }

  fechar(): void {
    this.fecharModal.emit();
  }

}
