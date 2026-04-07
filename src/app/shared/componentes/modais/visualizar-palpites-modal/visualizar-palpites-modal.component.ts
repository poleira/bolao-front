import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PalpiteService } from 'src/app/palpites/palpite.service';
import { PalpitesPorEscritoResponse } from 'src/app/shared/models/responses/palpites-por-escrito.response';

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
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarPalpites();
  }

  carregarPalpites(): void {
    this.palpiteService.obterPalpitesPorEscrito(this.nomeUsuario, this.hashBolao)
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
