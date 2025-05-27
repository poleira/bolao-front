import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  boloesUsuarios: BolaoUsuarioResponse[] = [];
  selectedBolaoUsuario: BolaoUsuarioResponse = new BolaoUsuarioResponse({});

  constructor(
    private bolaoService: BolaoService,
    private bolaoUsuarioService: BoloesUsuariosService,
    private router: Router,
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

  recuperaUsuarioLogado(): UsuarioResponse | null {
    const usuarioLogado = localStorage.getItem('usuario');

    return usuarioLogado ? JSON.parse(usuarioLogado) : null;
  }

  selecionaBolao(bolaoUsuario: BolaoUsuarioResponse): void {
    this.selectedBolaoUsuario = bolaoUsuario;

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
}
