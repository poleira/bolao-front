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

@Component({
  selector: 'app-criacao-bolao-formulario',
  templateUrl: './criacao-bolao-formulario.component.html',
  styleUrls: ['./criacao-bolao-formulario.component.css']
})
export class CriacaoBolaoFormularioComponent implements OnInit {

  formularioBolao!: FormGroup;

  regras: RegraResponse[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bolaoService: BolaoService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.recuperarRegras();
  }

  inicializarFormulario(): void {
    this.formularioBolao = this.formBuilder.group({
      NomeBolao: ['', Validators.required],
      Logo: ['', Validators.required],
      Premios: this.formBuilder.array([
        this.formBuilder.group({
          Descricao: ['', Validators.required],
          Colocacao: [1]
        })
      ]),
      Privacidade: ['publico', Validators.required],
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

    this.bolaoService.criarBolao(request)
      .pipe(finalize(() => this.spinner.hide("loadCriacaoBolao")))
      .subscribe({
        next: (response) => {
          this.toast.success('Bolão criado com sucesso');
          this.resetFormulario();
        },
        error: (error) => {
          this.toast.error('Erro ao criar o bolão');
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
}
