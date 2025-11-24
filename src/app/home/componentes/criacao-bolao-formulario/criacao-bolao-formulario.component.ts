import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BolaoRequest } from 'src/app/home/models/requests/bolao.request';
import { InserirPremioBolaoRequest } from 'src/app/home/models/requests/inserir-premio-bolao.request';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { BolaoService } from 'src/app/home/services/bolao.service';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { InserirRegraBolaoRequest } from 'src/app/home/models/requests/inserir-regra-bolao.request';
import { ActivatedRoute, Router } from '@angular/router';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';
import { BolaoEditarRequest } from 'src/app/home/models/requests/bolao-editar.request';

@Component({
  selector: 'app-criacao-bolao-formulario',
  templateUrl: './criacao-bolao-formulario.component.html',
  styleUrls: ['./criacao-bolao-formulario.component.css']
})
export class CriacaoBolaoFormularioComponent implements OnInit {

  formularioBolao!: FormGroup;
  regras: RegraResponse[] = [];
  modoEdicao: boolean = false;
  bolaoId?: number;

  bolao: BolaoResponse = new BolaoResponse({});

  constructor(
    private formBuilder: FormBuilder,
    private bolaoService: BolaoService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.recuperarRegras();
  }

  inicializarFormulario(): void {
    this.formularioBolao = this.formBuilder.group({
      NomeBolao: ['', Validators.required],
      Logo: ['Cup'],
      ModoJogo: [1],
      Premios: this.formBuilder.array([
        this.formBuilder.group({
          Descricao: ['', Validators.required],
          Colocacao: [1]
        })
      ]),
      Privacidade: ['publico'],
      Senha: [''],
      regras: this.formBuilder.group({})
    });
  }

  get premios(): FormArray {
    return this.formularioBolao.get('Premios') as FormArray;
  }

  adicionarPremio(): void {
    const position = this.premios.length + 1;
    this.premios.push(
      this.formBuilder.group({
        Descricao: ['', Validators.required],
        Colocacao: [position]
      })
    );
  }

  removerPremio(index: number): void {
    if (this.premios.length > 1) {
      this.premios.removeAt(index);

      for (let i = 0; i < this.premios.length; i++) {
        (this.premios.at(i) as FormGroup).get('Colocacao')?.setValue(i + 1);
      }
    }
  }

  buildBolaoRequest(): BolaoRequest | BolaoEditarRequest {
    const formData = this.formularioBolao.value;

    let bolaoEditarRequest = new BolaoEditarRequest({});
    let bolaoInserirRequest = new BolaoRequest({});

    const premios: InserirPremioBolaoRequest[] = formData.Premios.map(
      (premio: any) => new InserirPremioBolaoRequest({
        Descricao: premio.Descricao,
        Colocacao: premio.Colocacao
      })
    );

    const regras: InserirRegraBolaoRequest[] = [];
    const regrasControls = this.formularioBolao.get('regras')?.value;

    Object.keys(regrasControls).forEach(key => {
      const valor = Number(regrasControls[key]);
      if (!isNaN(valor) && valor > 0) {
        const regraEncontrada = this.regras.find(r => r.id.toString() === key);
        if (regraEncontrada) {
          regras.push(new InserirRegraBolaoRequest({ IdRegra: regraEncontrada.id, Pontuacao: valor }));
        }
      }
    });

    if (this.modoEdicao) {
      bolaoEditarRequest = new BolaoEditarRequest({
        Nome: formData.NomeBolao,
        Logo: formData.Logo,
        IdModoJogo: formData.ModoJogo,
        Aviso: '',
        Senha: formData.Senha,
        Privado: formData.Privacidade === 'privado',
        InserirRegrasBoloes: regras,
        InserirPremiosBoloes: premios
      });
    } else {
      bolaoInserirRequest = new BolaoRequest({
        Nome: formData.NomeBolao,
        Logo: formData.Logo,
        IdModoJogo: formData.ModoJogo,
        Aviso: '',
        HashUsuario: this.recuperaUsuarioLogado()?.firebaseUid,
        Senha: formData.Senha,
        Privado: formData.Privacidade === 'privado',
        InserirRegrasBoloes: regras,
        InserirPremiosBoloes: premios
      });
    }

    return this.modoEdicao ? bolaoEditarRequest : bolaoInserirRequest;
  }

  criarBolao(): void {
    const request: BolaoRequest = this.buildBolaoRequest() as BolaoRequest;
    this.spinner.show("loadCriacaoBolao");

    this.bolaoService.criarBolao(request)
      .pipe(finalize(() => this.spinner.hide("loadCriacaoBolao")))
      .subscribe({
        next: (response) => {
          this.toast.success(this.modoEdicao ? 'Bolão atualizado com sucesso' : 'Bolão criado com sucesso');
          if (!this.modoEdicao) {
            this.resetFormulario();
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.toast.error(this.modoEdicao ? 'Erro ao atualizar o bolão' : 'Erro ao criar o bolão');
        }
      });
  }

  editarBolao(): void {
    const request = this.buildBolaoRequest() as BolaoEditarRequest;
    request.HashBolao = this.bolao.tokenAcesso;

    this.spinner.show("loadCriacaoBolao");

    this.bolaoService.editarBolao(request)
      .pipe(finalize(() => this.spinner.hide("loadCriacaoBolao")))
      .subscribe({
        next: () => {
          this.toast.success('Bolão editado com sucesso');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.toast.error('Erro ao editar o bolão');
        }
      });
  }

  enviar() {
    this.modoEdicao ? this.editarBolao() : this.criarBolao();
  }

  resetFormulario(): void {
    this.formularioBolao.reset({
      NomeBolao: '',
      Logo: '',
      ModoJogo: 1,
      Privacidade: 'publico',
      Senha: ''
    });

    while (this.premios.length > 0) {
      this.premios.removeAt(0);
    }
    this.premios.push(
      this.formBuilder.group({
        Descricao: ['', Validators.required],
        Colocacao: [1]
      })
    );

    const regrasGroup = this.formularioBolao.get('regras') as FormGroup;
    Object.keys(regrasGroup.controls).forEach(key => {
      regrasGroup.get(key)?.setValue(0);
      regrasGroup.get(key)?.markAsPristine();
    });

    this.formularioBolao.markAsPristine();
    this.formularioBolao.markAsUntouched();
  }

  recuperaUsuarioLogado(): UsuarioResponse | null {
    const usuarioLogado = localStorage.getItem('usuario');

    return usuarioLogado ? JSON.parse(usuarioLogado) : null;
  }

  recuperarRegras(): void {
    this.bolaoService.recuperarRegras().subscribe({
      next: (regras: RegraResponse[]) => {
        this.regras = regras;

        const regrasGroup = this.formularioBolao.get('regras') as FormGroup;
        regras.forEach(regra => {
          regrasGroup.addControl(regra.id.toString(), this.formBuilder.control(0));
        });

        if (this.route.snapshot.paramMap.has('tokenAcesso')) {
          const tokenAcesso = this.route.snapshot.paramMap.get('tokenAcesso');
          this.modoEdicao = true;

          this.bolaoService.recuperarPorToken(tokenAcesso!)
            .subscribe({
              next: (reponse: BolaoResponse) => {
                this.bolao = reponse;
                this.preencherFormulario(this.bolao);
              },
              error: (error) => {
                this.toast.error('Erro ao carregar dados do bolão');
                this.router.navigate(['/home']);
              }
            });
        }
      }
    });
  }

  onRegraChange(regraId: number, event: any): void {
    const regrasGroup = this.formularioBolao.get('regras') as FormGroup;
    const control = regrasGroup.get(regraId.toString());
    if (control) {
      // kept for backward compatibility if needed; numeric inputs update directly
      control.setValue(event.target.checked ? 1 : 0);
      control.markAsDirty();
    }
  }

  preencherFormulario(bolao: BolaoResponse): void {
    while (this.premios.length > 0) {
      this.premios.removeAt(0);
    }

    if (bolao?.premios && bolao?.premios.length > 0) {
      bolao.premios.forEach(premio => {
        this.premios.push(
          this.formBuilder.group({
            Descricao: [premio.descricao, Validators.required],
            Colocacao: [premio.colocacao]
          })
        );
      });
    } else {
      this.premios.push(
        this.formBuilder.group({
          Descricao: ['', Validators.required],
          Colocacao: [1]
        })
      );
    }

    // map possible backend values (string or numeric) to numeric mode values 1/2/3
    const modoFromApi: any = bolao?.IdModoJogo;
    let modoValue = 1;
    if (modoFromApi !== undefined && modoFromApi !== null) {
      const modoStr = String(modoFromApi).toLowerCase();
      if (modoStr === 'rapido' || modoStr === '1') modoValue = 1;
      else if (modoStr === 'avancado' || modoStr === '2') modoValue = 2;
      else if (modoStr === 'pro' || modoStr === '3') modoValue = 3;
    }

    this.formularioBolao.patchValue({
      NomeBolao: bolao?.nome,
      Logo: bolao?.logo,
      ModoJogo: modoValue,
      Privacidade: bolao?.privacidade ? 'privado' : 'publico',
      Senha: bolao?.senha || ''
    });

    if (bolao?.regras && bolao?.regras.length > 0) {
      const regrasGroup = this.formularioBolao.get('regras') as FormGroup;

      bolao.regras.forEach(regra => {
        console.log(`Tentando definir regra ${regra.id}`, regra);
        const regraId = regra.regra?.id ?? regra.id;
        const regraControlId = regraId.toString();

        if (regrasGroup.contains(regraControlId)) {
          regrasGroup.get(regraControlId)?.setValue(regra.pontuacao || 0);
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
