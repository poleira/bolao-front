import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-regras',
  templateUrl: './regras.component.html',
  styleUrls: ['./regras.component.css']
})
export class RegrasComponent implements OnInit {
  bolao: BolaoResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bolaoService: BolaoService,
    private toast: ToastrService
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
        },
        error: (error) => {
          this.toast.error('Erro ao carregar as regras do bolão');
        }
      });
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}
