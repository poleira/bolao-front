import { Component, Input, OnInit } from '@angular/core';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-cabecalho',
    templateUrl: './cabecalho.component.html',
    styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent implements OnInit {
    @Input()
    cabecalho = '';

    isSideMenuOpen = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void { }

    toggleSideMenu(): void {
        this.isSideMenuOpen = !this.isSideMenuOpen;

        if (this.isSideMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    recuperarUsuarioLogado(): UsuarioResponse {
        const usuarioLogado = localStorage.getItem('usuario');

        let usuario: UsuarioResponse = new UsuarioResponse({});

        if (usuarioLogado) {
            usuario = JSON.parse(usuarioLogado);
        }

        return usuario;
    }

    logout() {
        this.spinner.show('logout');
        this.authService.logout()
            .pipe(finalize(() => this.spinner.hide('logout')))
            .subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: error => {
                    console.error('Erro ao fazer logout:', error);
                }
            });
    }
}
