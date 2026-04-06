import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RankService } from 'src/app/home/services/rank.service';
import { RankResponse } from 'src/app/home/models/responses/rank.response';
import { HashBolaoRequest } from 'src/app/shared/models/requests/hash-bolao.request';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("modalConvite", { static: true }) modalConvite!: TemplateRef<HTMLDivElement>;

  boloesUsuarios: BolaoUsuarioResponse[] = [];
  selectedBolaoUsuario: BolaoUsuarioResponse = new BolaoUsuarioResponse({});
  ranking: RankResponse[] = [];
  rankingPreview: RankResponse[] = [];
  readonly rankingMaxDisplay = 8;
  usuarioLogado: UsuarioResponse | null = null;

  modalRef!: BsModalRef;

  usuarioEhAdmin: boolean = false;

  constructor(
    private bolaoUsuarioService: BoloesUsuariosService,
    private bolaoService: BolaoService,
    private rankService: RankService,
    private usuarioService: UsuarioService,
    private router: Router,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarUsuarioLogado();
  }

  carregarUsuarioLogado(): void {
    this.spinner.show('carregando');

    this.usuarioService.obterUsuarioLogado()
      .pipe(finalize(() => this.spinner.hide('carregando')))
      .subscribe({
        next: (usuario: UsuarioResponse) => {
          this.usuarioLogado = usuario;
          this.recuperarBoloesUsuario();
        },
        error: () => {
          this.usuarioLogado = null;
          this.recuperarBoloesUsuario();
        }
      });
  }

  recuperarBoloesUsuario() {
    this.spinner.show('carregando');

    this.bolaoUsuarioService.recuperarBoloesUsuario()
      .pipe(finalize(() => this.spinner.hide('carregando')))
      .subscribe({
      next: (response: BolaoUsuarioResponse[]) => {
        this.boloesUsuarios = response;

        if (this.boloesUsuarios.length > 0) {
          this.selecionaBolao(this.boloesUsuarios[0]);
        } else {
          this.limparRanking();
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

  selecionaBolao(bolaoUsuario: BolaoUsuarioResponse): void {
    this.selectedBolaoUsuario = bolaoUsuario;
    this.usuarioEhAdmin = this.selectedBolaoUsuario?.bolao?.administrador === this.usuarioLogado?.nome;
    this.bolaoUsuarioService.setAdminState(this.usuarioEhAdmin, this.usuarioLogado?.nome ?? '');

    const token = this.selectedBolaoUsuario?.bolao?.tokenAcesso;
    if (token) {
      this.carregarRanking(token);
    } else {
      this.limparRanking();
    }
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

  verRanking(): void {
    if (this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.selectedBolaoUsuario.bolao.tokenAcesso);
      this.router.navigate(['/home', 'ranking', encodedToken]);
    }
  }

  verPremios(): void {
    if (this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.selectedBolaoUsuario.bolao.tokenAcesso);
      this.router.navigate(['/home', 'premios', encodedToken]);
    }
  }

  carregarRanking(tokenAcesso: string): void {
    const request = new HashBolaoRequest({ HashBolao: tokenAcesso });
    this.spinner.show('carregando');

    this.rankService.listar(request)
      .pipe(finalize(() => this.spinner.hide('carregando')))
      .subscribe({
      next: (dados: RankResponse[]) => {
        this.ranking = dados ?? [];
        this.rankingPreview = this.ranking.slice(0, this.rankingMaxDisplay);
      },
      error: () => {
        this.limparRanking();
      }
    });
  }

  trackRanking(index: number, item: RankResponse): string {
    return `${index}-${item.usuario}`;
  }

  getTrophyClasses(posicao: number): string {
    if (posicao === 0) {
      return 'fa-solid fa-trophy text-warning fs-5 mt-1';
    }

    if (posicao === 1) {
      return 'fa-solid fa-trophy text-secondary fs-5 mt-1';
    }

    if (posicao === 2) {
      return 'fa-solid fa-trophy bronze-trophy fs-5 mt-1';
    }

    return 'fa-solid fa-trophy bronze-trophy fs-5 invisible';
  }

  getTrophyColorClass(index: number): string {
    if (index === 0) return 'text-warning'; // Gold
    if (index === 1) return 'text-secondary'; // Silver
    if (index === 2) return 'bronze-trophy'; // Bronze
    return 'text-muted';
  }

  getPremioValue(descricao: string | undefined): string {
    if (!descricao) return '';
    // Extract number and unit (e.g., "1000 reais" -> "1000")
    const match = descricao.match(/^(\d+)/);
    return match ? match[1] : descricao;
  }

  getPremioLabel(descricao: string | undefined): string {
    if (!descricao) return '';
    // Extract label after number (e.g., "1000 reais" or "1000reais" -> "reais")
    const match = descricao.match(/^\d+\s*(\D+)/);
    return match ? match[1].trim() : '';
  }

  private limparRanking(): void {
    this.ranking = [];
    this.rankingPreview = [];
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

  sairBolao(): void {
    if (!this.selectedBolaoUsuario?.bolao?.tokenAcesso) {
      return;
    }

    Swal.fire({
      title: 'Sair do bolão?',
      text: `Tem certeza que deseja sair do bolão "${this.selectedBolaoUsuario.bolao.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const request = new AssociarUsuarioRequest({ 
          HashBolao: this.selectedBolaoUsuario.bolao!.tokenAcesso!,
          IdUsuarioASerAlterado: this.usuarioLogado?.id
        });
        this.spinner.show('carregando');
        this.bolaoService.desassociarUsuarioBolao(request)
          .pipe(finalize(() => this.spinner.hide('carregando')))
          .subscribe({
            next: () => {
              this.toastr.success('Você saiu do bolão com sucesso.', 'Sucesso');
              this.recuperarBoloesUsuario();
            },
            error: (error) => {
              this.toastr.error(error.error?.erro || 'Erro ao sair do bolão.', 'Erro');
              console.error('Erro ao sair do bolão:', error);
            }
          });
      }
    });
  }
}
