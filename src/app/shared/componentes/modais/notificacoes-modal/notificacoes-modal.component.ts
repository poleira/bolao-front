import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  constructor(private toastr: ToastrService, private notificacoesService: NotificacoesService, private bolaoService: BolaoService ) { }

  ngOnInit(): void {
    this.listarNotificacoes();
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  listarNotificacoes(){
    this.notificacoesService.listarNotificacoesPorUsuario().subscribe({
      next: (notificacoes: NotificacaoResponse[]) => {
        this.notificacoes = notificacoes;
      },
      error: (error) => {
        this.toastr.error('Erro ao listar notificações.', 'Erro');
        console.error('Erro ao listar notificações:', error);
      }
    });
  }
  
  aceitarConvite(notificacao: NotificacaoResponse): void {
    this.notificacoesService.aceitarSolicitacao(notificacao.id).subscribe({
      next: () => {
        this.marcarNotificacaoComoLida(notificacao);
      },
      error: (error) => {
        this.toastr.error('Erro ao aceitar convite.', 'Erro');
        console.error('Erro ao aceitar convite:', error);
      }
    });
  }

  marcarNotificacaoComoLida(notificacao: NotificacaoResponse): void {
    this.notificacoesService.marcarNotificacaoComoLida({ IdNotificacao: notificacao.id }).subscribe({
      next: () => {
        this.toastr.success('Notificação respondida com sucesso!', 'Sucesso');
        this.listarNotificacoes();
      },
      error: (error) => {
        this.toastr.error('Erro ao responder notificação.', 'Erro');
        console.error('Erro ao responder notificação:', error);
      }
    });
  }

  recusarConvite(notificacao: NotificacaoResponse): void {
    this.notificacoesService.excluirNotificacao(notificacao.id).subscribe({
      next: () => {
        this.toastr.success('Notificação recusada com sucesso!', 'Sucesso');
        this.listarNotificacoes();
      },
      error: (error) => {
        this.toastr.error('Erro ao recusar notificação.', 'Erro');
        console.error('Erro ao recusar notificação:', error);
      }
    });
  }


}
