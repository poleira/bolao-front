import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BolaoListarResponse } from 'src/app/home/models/responses/bolao-listar.response';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioViaHubRequest } from 'src/app/shared/models/requests/associar-usuario-hub.request';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';


export interface BolaoFiltrado {
  nome?: string;
  administrador?: string;
  premio?: string;
  status?: 'disponivel' | 'com-senha' | 'pedir-entrada';
}

@Component({
  selector: 'app-hub-boloes',
  templateUrl: './hub-boloes.component.html',
  styleUrls: ['./hub-boloes.component.css']
})
export class HubBoloesComponent implements OnInit {
  @ViewChild("modalSenha", { static: true }) modalSenha!: TemplateRef<HTMLDivElement>;
  modalRef!: BsModalRef;
  
  termoBusca: string = '';
  bolaoSelecionado: BolaoFiltrado | null = null;

  boloes: BolaoFiltrado[] = [];

  boloesFiltrados: BolaoFiltrado[] = [];

  constructor(private router: Router, private bolaoService: BolaoService, private spinner: NgxSpinnerService, private bolaoUsuarioService: BoloesUsuariosService, private modalService: BsModalService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.boloesFiltrados = this.boloes;
    this.buscarBoloes();
  }

  buscarBoloes(): void {
    this.spinner.show("carregando");
    this.bolaoService.listarBoloes({ Nome: this.termoBusca }).subscribe({
      next: (response: BolaoListarResponse[]) => {
        this.boloesFiltrados = response.map(bolao => ({
          nome: bolao.nome,
          administrador: bolao.usuario,
          premio: bolao.premio[0] || 'Sem prêmio definido',
          status: bolao.privado ? 'pedir-entrada' : (bolao.temSenha ? 'com-senha' : 'disponivel')
        }));
        this.spinner.hide("carregando");
      }
      , error: (error) => {
        console.error('Erro ao buscar bolões:', error);
        this.spinner.hide("carregando");
      }
    });
  }

  entrarBolao(bolao: BolaoFiltrado): void {
    if (bolao.status === 'disponivel') {
      this.spinner.show("carregando");
      this.bolaoUsuarioService.associarUsuarioBolaoViaHub(new AssociarUsuarioViaHubRequest({NomeBolao: bolao.nome, Senha: ""})).subscribe({
        next: () => {
          this.toastr.success(`Você entrou no bolão ${bolao.nome}`, 'Sucesso');
          this.spinner.hide("carregando");
          this.router.navigate(['home']);
        }
        ,error: (error) => {
          this.spinner.hide("carregando");
          this.toastr.error('Erro ao entrar no bolão. Verifique se o bolão existe ou se você já está participando.', 'Erro');
          console.error('Erro ao associar usuário ao bolão:', error);
        }
      });
    }
    else if (bolao.status === 'com-senha') {
      this.bolaoSelecionado = bolao;
      this.entrarComSenha();
    } 
    else if (bolao.status === 'pedir-entrada') {
      this.pedirEntrada(bolao);
    }
  }

  entrarComSenha(): void {
    this.openModal(this.modalSenha, 'modal-lg');
  }

  pedirEntrada(bolao: BolaoFiltrado): void {

  }

  getStatusText(status: string): string {
    switch(status) {
      case 'disponivel': return 'Entrar no bolão';
      case 'com-senha': return 'Entrar com senha';
      case 'pedir-entrada': return 'Pedir para entrar';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'com-senha': return '#198754';
      case 'pedir-entrada': return '#2196F3';
      default: return '#198754';
    }
  }

  navegarNovoBolao(): void {
    this.router.navigate(['home/criar-bolao']);
  }

  openModal(modal: TemplateRef<HTMLDivElement>, modalClass: string) {
    this.modalRef = this.modalService.show(modal, {
      class: modalClass,
      backdrop: true,
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  fecharModal() {
    this.modalRef.hide();
  }
}