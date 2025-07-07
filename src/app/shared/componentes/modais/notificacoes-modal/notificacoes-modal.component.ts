import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { NotificacaoResponse } from 'src/app/shared/models/responses/notificacao.response';
import { NotificacoesService } from 'src/app/shared/services/notificacoes.service';

@Component({
  selector: 'app-notificacoes-modal',
  templateUrl: './notificacoes-modal.component.html',
  styleUrls: ['./notificacoes-modal.component.css']
})
export class NotificacoesModalComponent implements OnInit {

  @Output() fecharModal = new EventEmitter<void>();
  notificacoes: NotificacaoResponse[] = [];

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private notificacoesService: NotificacoesService, private bolaoService: BolaoService ) { }

  ngOnInit(): void {
    this.listarNotificacoes();
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  listarNotificacoes(){
    this.spinner.show('carregando');
    this.notificacoesService.listarNotificacoesPorUsuario().subscribe({
      next: (notificacoes: NotificacaoResponse[]) => {
        this.notificacoes = notificacoes;
        this.spinner.hide('carregando');
      },
      error: (error) => {
        this.toastr.error('Erro ao listar notificações.', 'Erro');
        console.error('Erro ao listar notificações:', error);
        this.spinner.hide('carregando');
      }
    });
  }
  
  aceitarConvite(notificacao: NotificacaoResponse): void {
    this.spinner.show('carregando');
    this.notificacoesService.aceitarSolicitacao(notificacao.id).subscribe({
      next: () => {
        this.marcarNotificacaoComoLida(notificacao);
      },
      error: (error) => {
        this.toastr.error('Erro ao aceitar convite.', 'Erro');
        console.error('Erro ao aceitar convite:', error);
        this.spinner.hide('carregando');
      },
      complete: () => {
        this.spinner.hide('carregando');
      }
    });
  }

  marcarNotificacaoComoLida(notificacao: NotificacaoResponse): void {
    this.spinner.show('carregando');
    this.notificacoesService.marcarNotificacaoComoLida({ IdNotificacao: notificacao.id }).subscribe({
      next: () => {
        this.toastr.success('Notificação respondida com sucesso!', 'Sucesso');
        this.listarNotificacoes();
      },
      error: (error) => {
        this.toastr.error('Erro ao responder notificação.', 'Erro');
        console.error('Erro ao responder notificação:', error);
        this.spinner.hide('carregando');
      },
      complete: () => {
        this.spinner.hide('carregando');
      }
    });
  }

  recusarConvite(notificacao: NotificacaoResponse): void {
    this.spinner.show('carregando');
    this.notificacoesService.excluirNotificacao(notificacao.id).subscribe({
      next: () => {
        this.toastr.success('Notificação recusada com sucesso!', 'Sucesso');
        this.listarNotificacoes();
      },
      error: (error) => {
        this.toastr.error('Erro ao recusar notificação.', 'Erro');
        console.error('Erro ao recusar notificação:', error);
        this.spinner.hide('carregando');
      },
      complete: () => {
        this.spinner.hide('carregando');
      }
    });
  }


}
