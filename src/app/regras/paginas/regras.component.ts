import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';

@Component({
  selector: 'app-regras',
  templateUrl: './regras.component.html',
  styleUrls: ['./regras.component.css']
})
export class RegrasComponent implements OnInit {
  bolao: BolaoResponse | null = null;
  usuarioEhAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bolaoService: BolaoService,
    private toast: ToastrService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.has('tokenAcesso')) {
      const tokenAcesso = this.route.snapshot.paramMap.get('tokenAcesso');
      this.carregarBolao(tokenAcesso!);
    }
  }

  carregarBolao(tokenAcesso: string): void {
    this.bolaoService.recuperarPorToken(tokenAcesso)
      .subscribe({
        next: (response: BolaoResponse) => {
          this.bolao = response;
          this.verificarAdmin();
        },
        error: (error) => {
          this.toast.error('Erro ao carregar as regras do bolão');
        }
      });
  }

  private verificarAdmin(): void {
    this.usuarioService.obterUsuarioLogado().subscribe({
      next: (usuario: UsuarioResponse) => {
        this.usuarioEhAdmin = this.bolao?.administrador === usuario.nome;
      }
    });
  }

  navigateToEditBolao(): void {
    if (this.bolao?.tokenAcesso) {
      const encodedToken = encodeURIComponent(this.bolao.tokenAcesso);
      this.router.navigateByUrl('/home/editar-bolao/' + encodedToken);
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
