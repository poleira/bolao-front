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
        const authUser = sessionStorage.getItem('auth-user');

        let usuario: UsuarioResponse = new UsuarioResponse({});

        if (authUser) {
            const objeto = JSON.parse(authUser);
            usuario = objeto.usuario;
        }

        return usuario;
    }

    logout() {
        this.authService.logout()
    }
}
