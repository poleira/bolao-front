import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BolaoFiltrado } from 'src/app/hub-boloes/paginas/hub-boloes.component';
import { AssociarUsuarioViaHubRequest } from 'src/app/shared/models/requests/associar-usuario-hub.request';
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';

@Component({
  selector: 'app-senha-bolao-modal',
  templateUrl: './senha-bolao-modal.component.html',
  styleUrls: ['./senha-bolao-modal.component.css']
})
export class SenhaBolaoModalComponent implements OnInit {

  @Input() bolao: BolaoFiltrado = {};
  @Output() fecharModal = new EventEmitter<void>();
  senhaBolao: string = '';
  
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private bolaoUsuarioService: BoloesUsuariosService, private router: Router,) { }

  ngOnInit(): void {
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  entrarBolaoComSenha(): void {
    if (!this.senhaBolao) {
      this.toastr.error('Por favor, informe a senha do bolão.', 'Senha Inválida');
      return;
    }

    this.spinner.show('carregando');
    
    this.bolaoUsuarioService.associarUsuarioBolaoViaHub(new AssociarUsuarioViaHubRequest({NomeBolao: this.bolao.nome, Senha: this.senhaBolao})).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.toastr.success('Você entrou no bolão com sucesso!', 'Sucesso');
        this.fechar();
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Erro ao entrar no bolão.', 'Erro');
      },
      complete: () => {
        this.spinner.hide('carregando');
      }
    });
  }

}
