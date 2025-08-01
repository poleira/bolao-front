import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("modalConvite", { static: true }) modalConvite!: TemplateRef<HTMLDivElement>;

  boloesUsuarios: BolaoUsuarioResponse[] = [];
  selectedBolaoUsuario: BolaoUsuarioResponse = new BolaoUsuarioResponse({});

  modalRef!: BsModalRef;

  usuarioEhAdmin: boolean = false;

  constructor(
    private bolaoService: BolaoService,
    private bolaoUsuarioService: BoloesUsuariosService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.recuperarBoloesUsuario();

    if (this.boloesUsuarios && this.boloesUsuarios.length > 0) {
      this.selectedBolaoUsuario = this.boloesUsuarios[0];
    }
  }

  recuperarBoloesUsuario() {
    this.bolaoUsuarioService.recuperarBoloesUsuario(this.recuperaUsuarioLogado()?.firebaseUid ?? '').subscribe({
      next: (response: BolaoUsuarioResponse[]) => {
        this.boloesUsuarios = response;

        if (this.boloesUsuarios.length > 0) {
          this.selecionaBolao(this.boloesUsuarios[0]);
        }
      }
    });
  }

  navegarPalpitar(){
    if (this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.selectedBolaoUsuario.bolao.tokenAcesso);
      this.router.navigateByUrl('/palpites/' + encodedToken);
    }
  }

  recuperaUsuarioLogado(): UsuarioResponse | null {
    const usuarioLogado = sessionStorage.getItem('auth-user');

    return usuarioLogado ? JSON.parse(usuarioLogado).usuario : null;
  }

  selecionaBolao(bolaoUsuario: BolaoUsuarioResponse): void {
    this.selectedBolaoUsuario = bolaoUsuario;
    this.usuarioEhAdmin = this.selectedBolaoUsuario?.bolao?.administrador === this.recuperaUsuarioLogado()?.nome;
  }

  navigateToEditBolao(): void {
    if (this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.selectedBolaoUsuario.bolao.tokenAcesso);

      this.bolaoUsuarioService.receberBolaoUsuario(this.selectedBolaoUsuario);

      this.router.navigateByUrl('/home/editar-bolao/' + encodedToken);
    }
  }

  verRegras(): void {
    if (this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.selectedBolaoUsuario.bolao.tokenAcesso);
      this.router.navigateByUrl('/regras/' + encodedToken);
    }
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

  ingressarBolao() {
    this.router.navigateByUrl('/hub-boloes');
  }
}
