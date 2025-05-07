import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { BoloesUsuariosService } from 'src/app/shared/services/boloes-usuarios.service';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';

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

  bolaoUsuario: BolaoUsuarioResponse = new BolaoUsuarioResponse({});

  constructor(
    private formBuilder: FormBuilder,
    private bolaoService: BolaoService,
    private bolaoUsuarioService: BoloesUsuariosService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.recuperarRegras();

    if (this.route.snapshot.paramMap.has('id')) {
      this.bolaoId = Number(this.route.snapshot.paramMap.get('id'));
      this.modoEdicao = true;
      this.carregarDadosBolao(this.bolaoId);
    }
  }

  inicializarFormulario(): void {
    this.formularioBolao = this.formBuilder.group({
      NomeBolao: ['', Validators.required],
      Logo: ['Cup'],
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

  buildBolaoRequest(): BolaoRequest {
    const formData = this.formularioBolao.value;

    const premios: InserirPremioBolaoRequest[] = formData.Premios.map(
      (premio: any) => new InserirPremioBolaoRequest({
        Descricao: premio.Descricao,
        Colocacao: premio.Colocacao
      })
    );

    const regras: InserirRegraBolaoRequest[] = [];
    const regrasControls = this.formularioBolao.get('regras')?.value;

    Object.keys(regrasControls).forEach(key => {
      if (regrasControls[key]) {
        const regraEncontrada = this.regras.find(r => r.id.toString() === key);
        if (regraEncontrada) {
          regras.push(new InserirRegraBolaoRequest({ IdRegra: regraEncontrada.id }));
        }
      }
    });

    return new BolaoRequest({
      Nome: formData.NomeBolao,
      Logo: formData.Logo,
      Aviso: '',
      HashUsuario: this.recuperaUsuarioLogado()?.firebaseUid,
      Senha: formData.Senha,
      Privado: formData.Privacidade === 'privado',
      InserirRegrasBoloes: regras,
      InserirPremiosBoloes: premios
    });
  }

  criarBolao(): void {
    const request = this.buildBolaoRequest();
    this.spinner.show("loadCriacaoBolao");

    const observable = this.modoEdicao ?
      this.bolaoService.atualizarBolao(this.bolaoId!, request) :
      this.bolaoService.criarBolao(request);

    observable
      .pipe(finalize(() => this.spinner.hide("loadCriacaoBolao")))
      .subscribe({
        next: (response) => {
          this.toast.success(this.modoEdicao ? 'Bolão atualizado com sucesso' : 'Bolão criado com sucesso');
          if (!this.modoEdicao) {
            this.resetFormulario();
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.toast.error(this.modoEdicao ? 'Erro ao atualizar o bolão' : 'Erro ao criar o bolão');
        }
      });
  }

  resetFormulario(): void {
    this.formularioBolao.reset({
      NomeBolao: '',
      Logo: '',
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
      regrasGroup.get(key)?.setValue(false);
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
          regrasGroup.addControl(regra.id.toString(), this.formBuilder.control(false));
        });
      }
    });
  }

  onRegraChange(regraId: number, event: any): void {
    const regrasGroup = this.formularioBolao.get('regras') as FormGroup;
    const control = regrasGroup.get(regraId.toString());
    if (control) {
      control.setValue(event.target.checked);
      control.markAsDirty();
    }
  }

  carregarDadosBolao(id: number): void {
    this.spinner.show("loadCriacaoBolao");
    this.bolaoUsuarioService.recuperar(id)
      .pipe(finalize(() => this.spinner.hide("loadCriacaoBolao")))
      .subscribe({
        next: (bolaoUsuario: BolaoUsuarioResponse) => {
          this.bolaoUsuario = bolaoUsuario;
          this.preencherFormulario(bolaoUsuario);
        },
        error: (error) => {
          this.toast.error('Erro ao carregar dados do bolão');
          this.router.navigate(['/home']);
        }
      });
  }

  preencherFormulario(bolaoUsuario: BolaoUsuarioResponse): void {
    while (this.premios.length > 0) {
      this.premios.removeAt(0);
    }

    const bolao = bolaoUsuario.bolao;

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

    this.formularioBolao.patchValue({
      NomeBolao: bolao?.nome,
      Logo: bolao?.logo,
      Privacidade: bolao?.privacidade ? 'privado' : 'publico',
      Senha: bolao?.senha || ''
    });

    if (bolao?.regras && bolao?.regras.length > 0) {
      const regrasGroup = this.formularioBolao.get('regras') as FormGroup;
      
      bolao.regras.forEach(regra => {
        console.log(`Tentando definir regra ${regra.id}`, regra);
        const regraControlId = regra.id.toString();
        
        if (regrasGroup.contains(regraControlId)) {
          regrasGroup.get(regraControlId)?.setValue(true);
        }
      });
    }
  }
}
