import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';
import { PremioResponse } from '../../models/responses/premio.response';

@Component({
  selector: 'app-premios',
  templateUrl: './premios.component.html',
  styleUrls: ['./premios.component.css']
})
export class PremiosComponent implements OnInit {
  bolaoToken: string = '';
  premios: PremioResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bolaoUsuarioService: BoloesUsuariosService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.capturarToken();
  }

  capturarToken(): void {
    this.route.paramMap.subscribe(params => {
      const encodedToken = params.get('tokenAcesso') ?? '';
      this.bolaoToken = encodedToken ? decodeURIComponent(encodedToken) : '';
      if (this.bolaoToken) {
        this.carregarPremios();
      }
    });
  }

  carregarPremios(): void {
    this.spinner.show('carregando');

    this.bolaoUsuarioService.recuperarBoloesUsuario()
      .pipe(finalize(() => this.spinner.hide('carregando')))
      .subscribe({
        next: (boloesUsuarios) => {
          const bolaoEncontrado = boloesUsuarios.find(
            bu => bu.bolao?.tokenAcesso === this.bolaoToken
          );
          this.premios = bolaoEncontrado?.bolao?.premios ?? [];
        },
        error: () => {
          this.premios = [];
        }
      });
  }

  getTrophyColorClass(index: number): string {
    if (index === 0) return 'text-warning'; // Gold
    if (index === 1) return 'text-secondary'; // Silver
    if (index === 2) return 'bronze-trophy'; // Bronze
    return 'text-muted';
  }

  getPremioValue(descricao: string | undefined): string {
    if (!descricao) return '';
    const match = descricao.match(/^(\d+)/);
    return match ? match[1] : descricao;
  }

  getPremioLabel(descricao: string | undefined): string {
    if (!descricao) return '';
    const match = descricao.match(/^\d+\s*(.+)/);
    return match ? match[1] : '';
  }
}
