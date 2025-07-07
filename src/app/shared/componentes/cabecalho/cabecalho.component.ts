import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificacoesService } from '../../services/notificacoes.service';

@Component({
    selector: 'app-cabecalho',
    templateUrl: './cabecalho.component.html',
    styleUrls: ['./cabecalho.component.css'],
})
export class CabecalhoComponent implements OnInit {
    @ViewChild("modalNotificacoes", { static: true }) modalNotificacoes!: TemplateRef<HTMLDivElement>;
    modalRef!: BsModalRef;

    @Input()
    cabecalho = '';

    isSideMenuOpen = false;

    existeNotificacoes: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private modalService: BsModalService, 
        private notificacoesService: NotificacoesService
    ) { }

    ngOnInit(): void { 
        this.spinner.show('carregando');
        this.notificacoesService.validarSeUsuarioPossuiAlgumaNotificacaoNaoLida()
            .pipe(finalize(() => this.spinner.hide('carregando')))
            .subscribe({
                next: (existe: boolean) => {
                    this.existeNotificacoes = existe;
                },
                error: (error) => {
                    console.error('Erro ao verificar notificações:', error);
                    this.toastr.error('Erro ao verificar notificações.', 'Erro');
                }
            });
    }

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
        this.toastr.success('Logout realizado com sucesso!', 'Sucesso');
    }

    navegarHome() {
        this.router.navigate(['home']);
        this.isSideMenuOpen = false;
        document.body.style.overflow = '';
    }
    
    abrirModalNotificacoes(modal: TemplateRef<HTMLDivElement>, modalClass: string) {
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
}
