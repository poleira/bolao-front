import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-criacao-bolao-formulario',
  templateUrl: './criacao-bolao-formulario.component.html',
  styleUrls: ['./criacao-bolao-formulario.component.css']
})
export class CriacaoBolaoFormularioComponent implements OnInit {

  formularioBolao!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formularioBolao = this.formBuilder.group({
      NomeBolao: ['', Validators.required],
      Logo: ['', Validators.required],
      premios: this.formBuilder.array([
        this.formBuilder.control('', Validators.required)
      ]),
      Privacidade: ['publico', Validators.required],
      Senha: [''],
      regras: this.formBuilder.group({
        acertoExato: [false],
        vencedorPartida: [false],
        empate: [false],
        golsMarcados: [false],
        diferencaGols: [false]
      })
    });
  }

  get premios(): FormArray {
    return this.formularioBolao.get('premios') as FormArray;
  }

  adicionarPremio(): void {
    this.premios.push(this.formBuilder.control('', Validators.required));
  }

  removerPremio(index: number): void {
    if (this.premios.length > 1) {
      this.premios.removeAt(index);
    }
  }
  
  criarBolao(): void {
    if (this.formularioBolao.valid) {
      const bolaoData = this.formularioBolao.value;
      console.log('Dados do Bolão:', bolaoData);
      
      // Aqui você pode adicionar a lógica para enviar os dados para o backend
      // Por exemplo:
      // this.bolaoService.criarBolao(bolaoData).subscribe(
      //   (response) => {
      //     console.log('Bolão criado com sucesso', response);
      //     // Redirecionar para página de sucesso ou lista de bolões
      //   },
      //   (error) => {
      //     console.error('Erro ao criar bolão', error);
      //   }
      // );
    } else {
      // Marcar todos os campos como touched para mostrar validações
      Object.keys(this.formularioBolao.controls).forEach(campo => {
        const controle = this.formularioBolao.get(campo);
        controle?.markAsTouched();
      });
    }
  }
}
