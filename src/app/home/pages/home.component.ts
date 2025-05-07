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

  constructor(
    private bolaoService: BolaoService,
    private bolaoUsuarioService: BoloesUsuariosService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.recuperarBoloesUsuario();
  }

  recuperarBoloesUsuario() {
    this.bolaoUsuarioService.recuperarBoloesUsuario(this.recuperaUsuarioLogado()?.firebaseUid ?? '').subscribe({
      next: (response: BolaoUsuarioResponse[]) => {
        this.boloesUsuarios = response;
      }
    });
  }

  recuperaUsuarioLogado(): UsuarioResponse | null {
    const usuarioLogado = localStorage.getItem('usuario');

    return usuarioLogado ? JSON.parse(usuarioLogado) : null;
  }
}
