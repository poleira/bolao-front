import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AlterarNomeUsuarioRequest } from 'src/app/shared/models/requests/alterar-nome-usuario.request';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {
  
  alterarSenhaForm!: FormGroup;
  usuarioLogado: UsuarioResponse | null = null;
  editandoNome = false;
  novoNome = '';

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.construirFormulario();
    this.recuperarUsuarioLogado();
  }

  private construirFormulario(): void {
    this.alterarSenhaForm = this.formBuilder.group({
      senhaAtual: ['', [Validators.required, Validators.minLength(6)]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarNovaSenha: ['', [Validators.required, Validators.minLength(6)]]
    }, { 
      validators: this.senhasDevemSerIguais('novaSenha', 'confirmarNovaSenha')
    });
  }

  private senhasDevemSerIguais(campo1: string, campo2: string) {
    return (formGroup: FormGroup) => {
      const senha = formGroup.get(campo1);
      const confirmacao = formGroup.get(campo2);

      if (!senha || !confirmacao) {
        return null;
      }

      if (confirmacao.errors && !confirmacao.errors['senhasDiferentes']) {
        return null;
      }

      if (senha.value !== confirmacao.value) {
        confirmacao.setErrors({ senhasDiferentes: true });
      } else {
        confirmacao.setErrors(null);
      }

      return null;
    };
  }

  recuperarUsuarioLogado() {
        const authUser = sessionStorage.getItem('auth-user');

        if (authUser) {
            const objeto = JSON.parse(authUser);
            this.usuarioLogado = objeto.usuario;
        }
    }

  async alterarSenha(): Promise<void> {
    if (this.alterarSenhaForm.invalid) {
      this.toastr.error('Por favor, preencha todos os campos corretamente.', 'Formulário Inválido');
      return;
    }

    const { senhaAtual, novaSenha } = this.alterarSenhaForm.value;

    try {
      // Obter o usuário atual do Firebase
      const user = await this.afAuth.currentUser;
      
      if (!user || !user.email) {
        this.toastr.error('Usuário não autenticado.', 'Erro');
        return;
      }

      // Reautenticar o usuário com a senha atual
      const credential = await this.reautenticarUsuario(user.email, senhaAtual);
      
      if (!credential) {
        return;
      }

      // Alterar a senha
      await user.updatePassword(novaSenha);

      this.toastr.success('Senha alterada com sucesso!', 'Sucesso');
      this.alterarSenhaForm.reset();

    } catch (error: any) {
      this.tratarErroAlteracaoSenha(error);
    }
  }

  private async reautenticarUsuario(email: string, senhaAtual: string): Promise<any> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, senhaAtual);
      return credential;
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.toastr.error('Senha atual incorreta.', 'Erro de Autenticação');
      } else {
        this.toastr.error('Erro ao verificar senha atual.', 'Erro');
      }
      return null;
    }
  }

  private tratarErroAlteracaoSenha(error: any): void {
    console.error('Erro ao alterar senha:', error);

    switch (error.code) {
      case 'auth/weak-password':
        this.toastr.error('A nova senha é muito fraca.', 'Senha Inválida');
        break;
      case 'auth/requires-recent-login':
        this.toastr.error('Por segurança, você precisa fazer login novamente antes de alterar a senha.', 'Sessão Expirada');
        break;
      default:
        this.toastr.error('Erro ao alterar senha. Tente novamente.', 'Erro');
        break;
    }
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  iniciarEdicaoNome(): void {
    this.novoNome = this.usuarioLogado?.nome || '';
    this.editandoNome = true;
  }

  cancelarEdicaoNome(): void {
    this.editandoNome = false;
    this.novoNome = '';
  }

  salvarNovoNome(): void {
    if (!this.novoNome || this.novoNome.trim() === '') {
      this.toastr.error('O nome não pode estar vazio.', 'Nome Inválido');
      return;
    }

    if (this.novoNome === this.usuarioLogado?.nome) {
      this.cancelarEdicaoNome();
      return;
    }

    const request = new AlterarNomeUsuarioRequest({ novoNome: this.novoNome.trim() });

    this.usuarioService.alterarNome(request)
      .subscribe({
        next: (response) => {
          this.toastr.success(response.mensagem || 'Nome alterado com sucesso!', 'Sucesso');
          
          // Atualizar o nome localmente
          if (this.usuarioLogado) {
            this.usuarioLogado.nome = this.novoNome.trim();
            
            // Atualizar também no sessionStorage
            const authUser = sessionStorage.getItem('auth-user');
            if (authUser) {
              const objeto = JSON.parse(authUser);
              objeto.usuario.nome = this.novoNome.trim();
              sessionStorage.setItem('auth-user', JSON.stringify(objeto));
            }
          }
          
          this.cancelarEdicaoNome();
        },
        error: (error) => {
          this.toastr.error(error.error?.erro || 'Erro ao alterar nome. Tente novamente.', 'Erro');
        }
      });
  }
}
