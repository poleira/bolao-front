import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { debounceTime } from 'rxjs/operators';
import { MOCK_SELECOES_ELIMINATORIA } from './mock';

export interface SelecoesEliminatoriaResponse {
  IdGrupo: string;
  SelecaoResponse: SelecaoResponse;
  PosicaoSelecaoSelecionada: number;
}

export interface Jogo {
  timeA: SelecaoResponse | null;
  timeB: SelecaoResponse | null;
  palpiteTimeA?: number;
  palpiteTimeB?: number;
  vencedor?: SelecaoResponse | null;
  perdedor?: SelecaoResponse | null;
}

@Component({
  selector: 'app-fase-eliminatoria',
  templateUrl: './fase-eliminatoria-modal.component.html',
  styleUrls: ['./fase-eliminatoria-modal.component.css']
})
export class FaseEliminatoriaModalComponent implements OnInit, OnChanges {

  @Input() selecoesClassificadas: SelecoesEliminatoriaResponse[] = MOCK_SELECOES_ELIMINATORIA;
  @Input() modoClicarParaAvancarDeFase: boolean = false;
  @Input() habilitado: boolean = true;
  @Output() salvar = new EventEmitter<any>();

  eliminatoriasForm: FormGroup;
  dezesseisAvos: Jogo[] = Array.from({ length: 16 }, () => ({ timeA: null, timeB: null }));
  oitavas: Jogo[] = Array.from({ length: 8 }, () => ({ timeA: null, timeB: null }));
  quartas: Jogo[] = Array.from({ length: 4 }, () => ({ timeA: null, timeB: null }));
  semifinais: Jogo[] = Array.from({ length: 2 }, () => ({ timeA: null, timeB: null }));
  terceiroLugar: Jogo = { timeA: null, timeB: null };
  final: Jogo = { timeA: null, timeB: null };



  constructor(private fb: FormBuilder) {
    this.eliminatoriasForm = this.criarFormularioVazio();
  }

  private criarFormularioVazio(): FormGroup {
    return this.fb.group({
      dezesseisAvos: this.fb.array(
        this.dezesseisAvos.map(() =>
          this.fb.group({
            palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
            palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
          })
        )
      ),
      oitavas: this.fb.array(
        Array(8).fill(null).map(() =>
          this.fb.group({
            palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
            palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
          })
        )
      ),
      quartas: this.fb.array(
        Array(4).fill(null).map(() =>
          this.fb.group({
            palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
            palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
          })
        )
      ),
      semifinais: this.fb.array(
        Array(2).fill(null).map(() =>
          this.fb.group({
            palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
            palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
          })
        )
      ),
      terceiroLugar: this.fb.group({
        palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
        palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
      }),
      final: this.fb.group({
        palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
        palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
      }),
    });
  }

  ngOnInit(): void {
    if (this.selecoesClassificadas && this.selecoesClassificadas.length > 0) {
      this.reiniciarEstrutura();
      this.montarDezesseisAvosDeFinal();
      this.montarOitavasDeFinal();
      this.inicializarFormulariosParaFases();
      if (!this.modoClicarParaAvancarDeFase) {
        this.escutarMudancasNosPalpites();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selecoesClassificadas'] && this.selecoesClassificadas.length > 0) {
      this.reiniciarEstrutura();
      this.montarDezesseisAvosDeFinal();
      this.inicializarFormulariosParaFases();
      if (!this.modoClicarParaAvancarDeFase) {
        this.escutarMudancasNosPalpites();
      }
    }
  }
  
  private reiniciarEstrutura(): void {
    this.eliminatoriasForm = this.criarFormularioVazio();
    this.oitavas = [];
    this.quartas = Array(4).fill({ timeA: null, timeB: null });
    this.semifinais = Array(2).fill({ timeA: null, timeB: null });
    this.terceiroLugar = { timeA: null, timeB: null };
    this.final = { timeA: null, timeB: null };
  }

  private getSelecaoPorPosicao(idGrupo: string, posicao: number): SelecaoResponse | null {
    const classificado = this.selecoesClassificadas.find(s =>
      s.IdGrupo.toUpperCase() == idGrupo.toUpperCase() && s.PosicaoSelecaoSelecionada === posicao
    );
    return classificado ? classificado.SelecaoResponse : null;
  }

  montarDezesseisAvosDeFinal(): void {
    const grupos = 'ABCDEFGHIJKLMNOP'.split('');
    const timesClassificados: SelecaoResponse[] = [];

    // Pega 2 times de cada grupo
    grupos.forEach(grupo => {
      const t1 = this.getSelecaoPorPosicao(grupo, 1);
      const t2 = this.getSelecaoPorPosicao(grupo, 2);
      if (t1) timesClassificados.push(t1);
      if (t2) timesClassificados.push(t2);
    });

    // Monta 16 jogos (1/16) pegando pares sequenciais
    this.dezesseisAvos = [];
    for (let i = 0; i < timesClassificados.length; i += 2) {
      const timeA = timesClassificados[i] || null;
      const timeB = timesClassificados[i + 1] || null;
      this.dezesseisAvos.push({ timeA, timeB });
    }
  }

  montarOitavasDeFinal(): void {
    this.oitavas = Array.from({ length: 8 }, (_, i) => ({
      timeA: this.dezesseisAvos[i * 2]?.vencedor ?? null,
      timeB: this.dezesseisAvos[i * 2 + 1]?.vencedor ?? null
    }));
  }

  private inicializarFormulariosParaFases(): void {
    const fases = ['dezesseisAvos', 'oitavas', 'quartas', 'semifinais'];
    const tamanhos = [16, 8, 4, 2];

    fases.forEach((fase, index) => {
      const formArray = this.eliminatoriasForm.get(fase) as FormArray;
      for (let i = 0; i < tamanhos[index]; i++) {
        if (!formArray.at(i)) { // garante que não duplicará
          formArray.push(this.fb.group({
            palpiteTimeA: [null, [Validators.required, Validators.min(0)]],
            palpiteTimeB: [null, [Validators.required, Validators.min(0)]],
          }));
        }
      }
    });
  }


  private escutarMudancasNosPalpites(): void {
    const fases: { nome: 'dezesseisAvos' | 'oitavas' | 'quartas' | 'semifinais' }[] = [
      { nome: 'dezesseisAvos' },
      { nome: 'oitavas' },
      { nome: 'quartas' },
      { nome: 'semifinais' }
    ];

    fases.forEach(faseInfo => {
      const faseArray = this.eliminatoriasForm.get(faseInfo.nome) as FormArray;
      if (faseArray) {
        faseArray.valueChanges.pipe(debounceTime(300)).subscribe(() => {
          this.atualizarProximaFase(faseInfo.nome);
        });
      }
    });
  }

  
  private determinarVencedorEPerdedor(jogo: Jogo, palpite: { palpiteTimeA: number, palpiteTimeB: number }): { vencedor: SelecaoResponse | null, perdedor: SelecaoResponse | null } {
    if (palpite.palpiteTimeA === null || palpite.palpiteTimeB === null || !jogo.timeA || !jogo.timeB) {
      return { vencedor: null, perdedor: null };
    }
    if (palpite.palpiteTimeA >= palpite.palpiteTimeB) {
      return { vencedor: jogo.timeA, perdedor: jogo.timeB };
    }
    return { vencedor: jogo.timeB, perdedor: jogo.timeA };
  }

  selecionarVencedor(jogo: Jogo, vencedor: SelecaoResponse, fase: 'dezesseisAvos' | 'oitavas' | 'quartas' | 'semifinais' | 'final' | 'terceiroLugar') {
    if (!this.modoClicarParaAvancarDeFase) return;

    jogo.vencedor = vencedor;
    jogo.perdedor = jogo.timeA === vencedor ? jogo.timeB : jogo.timeA;

    // Simula placar para reutilizar lógica existente
    if (jogo.timeA === vencedor) {
        jogo.palpiteTimeA = 1;
        jogo.palpiteTimeB = 0;
    } else {
        jogo.palpiteTimeA = 0;
        jogo.palpiteTimeB = 1;
    }

    if (fase === 'dezesseisAvos' || fase === 'oitavas' || fase === 'quartas' || fase === 'semifinais') {
        this.atualizarProximaFasePorClique(fase);
    }
  }

  private atualizarProximaFasePorClique(faseAnterior: 'dezesseisAvos' | 'oitavas' | 'quartas' | 'semifinais'): void {
    const jogosAnteriores = this[faseAnterior];

    const proximaFaseJogos = 
        faseAnterior === 'dezesseisAvos' ? this.oitavas :
        faseAnterior === 'oitavas' ? this.quartas :
        faseAnterior === 'quartas' ? this.semifinais :
        null;

    if (proximaFaseJogos) {
        for (let i = 0; i < jogosAnteriores.length; i += 2) {
            const vencedor1 = jogosAnteriores[i]?.vencedor;
            const vencedor2 = jogosAnteriores[i + 1]?.vencedor;
            proximaFaseJogos[i / 2] = { timeA: vencedor1 ?? null, timeB: vencedor2 ?? null, vencedor: null, perdedor: null };
        }
    }
    
    if (faseAnterior === 'semifinais') {
        const vencedorSemi1 = this.semifinais[0].vencedor;
        const vencedorSemi2 = this.semifinais[1].vencedor;
        this.final = { timeA: vencedorSemi1 ?? null, timeB: vencedorSemi2 ?? null, vencedor: null, perdedor: null };

        const perdedorSemi1 = this.semifinais[0].perdedor;
        const perdedorSemi2 = this.semifinais[1].perdedor;
        this.terceiroLugar = { timeA: perdedorSemi1 ?? null, timeB: perdedorSemi2 ?? null, vencedor: null, perdedor: null };
    }
  }

  private atualizarProximaFase(faseAnterior: 'dezesseisAvos' | 'oitavas' | 'quartas' | 'semifinais'): void {
    const palpites = (this.eliminatoriasForm.get(faseAnterior) as FormArray).value;
    const jogosAnteriores = this[faseAnterior];

    let proximaFaseJogos: Jogo[];

    switch(faseAnterior) {
      case 'dezesseisAvos':
        proximaFaseJogos = this.oitavas;
        break;
      case 'oitavas':
        proximaFaseJogos = this.quartas;
        break;
      case 'quartas':
        proximaFaseJogos = this.semifinais;
        break;
      case 'semifinais':
        // Atualiza a final
        const vencedorSemi1 = this.determinarVencedorEPerdedor(this.semifinais[0], palpites[0]).vencedor;
        const vencedorSemi2 = this.determinarVencedorEPerdedor(this.semifinais[1], palpites[1]).vencedor;
        this.final = { timeA: vencedorSemi1, timeB: vencedorSemi2 };
        this.atualizarDisputaTerceiroLugar();
        return;
    }

    // Preenche a próxima fase em pares de vencedores
    for (let i = 0; i < palpites.length; i += 2) {
      const vencedor1 = this.determinarVencedorEPerdedor(jogosAnteriores[i], palpites[i]).vencedor;
      const vencedor2 = this.determinarVencedorEPerdedor(jogosAnteriores[i + 1], palpites[i + 1]).vencedor;
      proximaFaseJogos[i / 2] = { timeA: vencedor1, timeB: vencedor2 };
    }
  }

  
  private atualizarDisputaTerceiroLugar(): void {
    const palpitesSemis = (this.eliminatoriasForm.get('semifinais') as FormArray).value;
    if (palpitesSemis.length < 2 || !palpitesSemis[0] || !palpitesSemis[1]) return;

    const perdedorSemi1 = this.determinarVencedorEPerdedor(this.semifinais[0], palpitesSemis[0]).perdedor;
    const perdedorSemi2 = this.determinarVencedorEPerdedor(this.semifinais[1], palpitesSemis[1]).perdedor;
    
    this.terceiroLugar = { timeA: perdedorSemi1, timeB: perdedorSemi2 };
  }

  get oitavasControls(): AbstractControl[] {
    return (this.eliminatoriasForm.get('oitavas') as FormArray).controls;
  }
  get quartasControls(): AbstractControl[] {
    return (this.eliminatoriasForm.get('quartas') as FormArray).controls;
  }
  get semifinaisControls(): AbstractControl[] {
    return (this.eliminatoriasForm.get('semifinais') as FormArray).controls;
  }
  get finalFormGroup(): FormGroup {
    return this.eliminatoriasForm.get('final') as FormGroup;
  }
  get terceiroLugarFormGroup(): FormGroup {
    return this.eliminatoriasForm.get('terceiroLugar') as FormGroup;
  }
  get dezesseisAvosControls() {
    return (this.eliminatoriasForm.get('dezesseisAvos') as FormArray).controls;
  }

  salvarPalpites(): void {
    if (this.eliminatoriasForm.valid) {
      this.salvar.emit(this.eliminatoriasForm.value);
    } else {
      console.error('Formulário inválido! Verifique os campos.');
      this.eliminatoriasForm.markAllAsTouched();
    }
  }
}