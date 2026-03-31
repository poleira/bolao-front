import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { debounceTime } from 'rxjs/operators';
import { MOCK_SELECOES_ELIMINATORIA } from './mock';
import { PalpiteService } from '../../palpite.service';
import { EliminatoriasResponse } from 'src/app/shared/models/responses/eliminatorias.response';
import { CriarPalpiteFaseSelecaoRequest } from 'src/app/shared/models/requests/criar-palpite-fase-selecao.request';
import { ToastrService } from 'ngx-toastr';

export interface SelecoesEliminatoriaResponse {
  IdGrupo: string;
  SelecaoResponse: SelecaoResponse;
  PosicaoSelecaoSelecionada: number;
}
export interface Fase {
  IdFase: number;
  Descricao: string;
}

export interface Jogo {
  timeA: SelecaoResponse | null;
  timeB: SelecaoResponse | null;
  palpiteTimeA?: number;
  palpiteTimeB?: number;
  vencedor?: SelecaoResponse | null;
  perdedor?: SelecaoResponse | null;
}

export const FASES: Fase[] = [
  { IdFase: 1, Descricao: 'Rodada de 16' },
  { IdFase: 2, Descricao: 'Oitavas de Final' },
  { IdFase: 3, Descricao: 'Quartas de Final' },
  { IdFase: 4, Descricao: 'Semifinais' },
  { IdFase: 5, Descricao: 'Final' },
  { IdFase: 6, Descricao: 'Disputa de Terceiro' },
  { IdFase: 7, Descricao: 'Campeão' },
  { IdFase: 8, Descricao: 'Terceiro' },

];

@Component({
  selector: 'app-fase-eliminatoria',
  templateUrl: './fase-eliminatoria-accordion.component.html',
  styleUrls: ['./fase-eliminatoria-accordion.component.css']
})
export class FaseEliminatoriaAccordionComponent implements OnInit, OnChanges {

  selecoesClassificadas: SelecoesEliminatoriaResponse[] = MOCK_SELECOES_ELIMINATORIA;
  @Input() modoClicarParaAvancarDeFase: boolean = false;
  @Input() habilitado: boolean = true;
  @Input() hashBolao: string = '';
  @Output() salvar = new EventEmitter<any>();

  eliminatoriasForm: FormGroup;
  dezesseisAvos: Jogo[] = Array.from({ length: 16 }, () => ({ timeA: null, timeB: null }));
  oitavas: Jogo[] = Array.from({ length: 8 }, () => ({ timeA: null, timeB: null }));
  quartas: Jogo[] = Array.from({ length: 4 }, () => ({ timeA: null, timeB: null }));
  semifinais: Jogo[] = Array.from({ length: 2 }, () => ({ timeA: null, timeB: null }));
  terceiroLugar: Jogo = { timeA: null, timeB: null };
  final: Jogo = { timeA: null, timeB: null };



  constructor(private fb: FormBuilder, private palpiteService: PalpiteService, private toastr: ToastrService) {
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
      
      if (this.hashBolao) {
        this.recuperarEliminatorias();
      }
      
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

  recuperarEliminatorias(): void {
    this.palpiteService.recuperarEliminatorias(this.hashBolao).subscribe((response: EliminatoriasResponse) => {
      
      // Preencher Rodada de 16 
      if (response.rodadaDe16 && response.rodadaDe16.length > 0) {
        response.rodadaDe16.forEach((jogo, index) => {
          if (index < this.dezesseisAvos.length) {
            this.dezesseisAvos[index].timeA = jogo.selecao1 || null;
            this.dezesseisAvos[index].timeB = jogo.selecao2 || null;
          }
        });
      }

      // Preencher Oitavas
      if (response.oitavas && response.oitavas.length > 0) {
        response.oitavas.forEach((jogo, index) => {
          if (index < this.oitavas.length) {
            this.oitavas[index].timeA = jogo.selecao1 || null;
            this.oitavas[index].timeB = jogo.selecao2 || null;
          }
        });
      }

      // Preencher Quartas
      if (response.quartas && response.quartas.length > 0) {
        response.quartas.forEach((jogo, index) => {
          if (index < this.quartas.length) {
            this.quartas[index].timeA = jogo.selecao1 || null;
            this.quartas[index].timeB = jogo.selecao2 || null;
          }
        });
      }

      // Preencher Semifinais
      if (response.semis && response.semis.length > 0) {
        response.semis.forEach((jogo, index) => {
          if (index < this.semifinais.length) {
            this.semifinais[index].timeA = jogo.selecao1 || null;
            this.semifinais[index].timeB = jogo.selecao2 || null;
          }
        });
      }

      // Preencher Final
      if (response.finais) {
        this.final.timeA = response.finais.selecao1 || null;
        this.final.timeB = response.finais.selecao2 || null;
      }

      // Preencher Disputa de Terceiro
      if (response.disputaDeTerceiro) {
        this.terceiroLugar.timeA = response.disputaDeTerceiro.selecao1 || null;
        this.terceiroLugar.timeB = response.disputaDeTerceiro.selecao2 || null;
      }

      const determinarVencedorComProximaFase = (
        jogosAtual: Jogo[],
        jogosResponseAtual: EliminatoriasResponse['rodadaDe16' | 'oitavas' | 'quartas'],
        jogosResponseProximaFase?: EliminatoriasResponse['oitavas' | 'quartas' | 'semis']
      ): void => {
        if (!jogosResponseAtual) {
          return;
        }

        jogosResponseAtual.forEach((jogoResponse, index) => {
          const jogoLocal = jogosAtual[index];
          if (!jogoLocal || !jogoResponse || jogoResponse.proximoJogoVencedor == null) {
            return;
          }

          const proximoIndice = jogoResponse.proximoJogoVencedor - 1;
          const proximoJogo = jogosResponseProximaFase?.[proximoIndice];
          if (!proximoJogo) {
            return;
          }

          const selecao1 = jogoResponse.selecao1 || null;
          const selecao2 = jogoResponse.selecao2 || null;
          const avancouSelecao1 = selecao1 && (proximoJogo.selecao1?.id === selecao1.id || proximoJogo.selecao2?.id === selecao1.id);
          const avancouSelecao2 = selecao2 && (proximoJogo.selecao1?.id === selecao2.id || proximoJogo.selecao2?.id === selecao2.id);

          if (avancouSelecao1) {
            jogoLocal.vencedor = selecao1;
            jogoLocal.perdedor = selecao2;
          } else if (avancouSelecao2) {
            jogoLocal.vencedor = selecao2;
            jogoLocal.perdedor = selecao1;
          } else {
            jogoLocal.vencedor = null;
            jogoLocal.perdedor = null;
          }
        });
      };

      determinarVencedorComProximaFase(this.dezesseisAvos, response.rodadaDe16, response.oitavas);
      determinarVencedorComProximaFase(this.oitavas, response.oitavas, response.quartas);
      determinarVencedorComProximaFase(this.quartas, response.quartas, response.semis);

      if (response.semis) {
        response.semis.forEach((jogoResponse, index) => {
          const jogoLocal = this.semifinais[index];
          if (!jogoLocal || !jogoResponse) {
            return;
          }

          const selecao1 = jogoResponse.selecao1 || null;
          const selecao2 = jogoResponse.selecao2 || null;

          const avancouParaFinalSelecao1 = selecao1 && (response.finais?.selecao1?.id === selecao1.id || response.finais?.selecao2?.id === selecao1.id);
          const avancouParaFinalSelecao2 = selecao2 && (response.finais?.selecao1?.id === selecao2.id || response.finais?.selecao2?.id === selecao2.id);

          if (avancouParaFinalSelecao1) {
            jogoLocal.vencedor = selecao1;
            jogoLocal.perdedor = selecao2;
          } else if (avancouParaFinalSelecao2) {
            jogoLocal.vencedor = selecao2;
            jogoLocal.perdedor = selecao1;
          } else if (response.disputaDeTerceiro) {
            const disputouTerceiroSelecao1 = selecao1 && (response.disputaDeTerceiro.selecao1?.id === selecao1.id || response.disputaDeTerceiro.selecao2?.id === selecao1.id);
            const disputouTerceiroSelecao2 = selecao2 && (response.disputaDeTerceiro.selecao1?.id === selecao2.id || response.disputaDeTerceiro.selecao2?.id === selecao2.id);

            if (disputouTerceiroSelecao1) {
              jogoLocal.vencedor = selecao2;
              jogoLocal.perdedor = selecao1;
            } else if (disputouTerceiroSelecao2) {
              jogoLocal.vencedor = selecao1;
              jogoLocal.perdedor = selecao2;
            } else {
              jogoLocal.vencedor = null;
              jogoLocal.perdedor = null;
            }
          }
        });
      }

      if (response.finais) {
        if (response.campeao) {
          const vencedorFinal = this.final.timeA?.id === response.campeao.id ? this.final.timeA : this.final.timeB?.id === response.campeao.id ? this.final.timeB : null;
          this.final.vencedor = vencedorFinal || null;
          this.final.perdedor = vencedorFinal ? (vencedorFinal === this.final.timeA ? this.final.timeB : this.final.timeA) : null;
        } else {
          this.final.vencedor = null;
          this.final.perdedor = null;
        }
      }

      if (response.disputaDeTerceiro) {
        if (response.terceiroLugar) {
          const vencedorTerceiro = this.terceiroLugar.timeA?.id === response.terceiroLugar.id ? this.terceiroLugar.timeA : this.terceiroLugar.timeB?.id === response.terceiroLugar.id ? this.terceiroLugar.timeB : null;
          this.terceiroLugar.vencedor = vencedorTerceiro || null;
          this.terceiroLugar.perdedor = vencedorTerceiro ? (vencedorTerceiro === this.terceiroLugar.timeA ? this.terceiroLugar.timeB : this.terceiroLugar.timeA) : null;
        } else {
          this.terceiroLugar.vencedor = null;
          this.terceiroLugar.perdedor = null;
        }
      }
    });
  }
  
  private reiniciarEstrutura(): void {
    this.dezesseisAvos = Array.from({ length: 16 }, () => ({ timeA: null, timeB: null }));
    this.oitavas = Array.from({ length: 8 }, () => ({ timeA: null, timeB: null }));
    this.quartas = Array.from({ length: 4 }, () => ({ timeA: null, timeB: null }));
    this.semifinais = Array.from({ length: 2 }, () => ({ timeA: null, timeB: null }));
    this.terceiroLugar = { timeA: null, timeB: null };
    this.final = { timeA: null, timeB: null };
    this.eliminatoriasForm = this.criarFormularioVazio();
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
    // No modo de clique, não validamos o formulário pois os vencedores vêm dos objetos Jogo
    const deveValidarFormulario = !this.modoClicarParaAvancarDeFase;
    
    if (deveValidarFormulario && !this.eliminatoriasForm.valid) {
      console.error('Formulário inválido! Verifique os campos.');
      this.eliminatoriasForm.markAllAsTouched();
      this.toastr.error('Erro!', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    const requests: CriarPalpiteFaseSelecaoRequest[] = [];

    // Processar Rodada de 16 (IdFase = 1) - Enviar todas as seleções
    this.dezesseisAvos.forEach((jogo, index) => {
      if (jogo.timeA && jogo.timeA.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 1,
          IdSelecao: jogo.timeA.id,
          HashBolao: this.hashBolao
        }));
      }
      if (jogo.timeB && jogo.timeB.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 1,
          IdSelecao: jogo.timeB.id,
          HashBolao: this.hashBolao
        }));
      }
    });

    // Processar Oitavas (IdFase = 2) - Enviar todas as seleções
    this.oitavas.forEach((jogo, index) => {
      if (jogo.timeA && jogo.timeA.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 2,
          IdSelecao: jogo.timeA.id,
          HashBolao: this.hashBolao
        }));
      }
      if (jogo.timeB && jogo.timeB.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 2,
          IdSelecao: jogo.timeB.id,
          HashBolao: this.hashBolao
        }));
      }
    });

    // Processar Quartas (IdFase = 3) - Enviar todas as seleções
    this.quartas.forEach((jogo, index) => {
      if (jogo.timeA && jogo.timeA.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 3,
          IdSelecao: jogo.timeA.id,
          HashBolao: this.hashBolao
        }));
      }
      if (jogo.timeB && jogo.timeB.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 3,
          IdSelecao: jogo.timeB.id,
          HashBolao: this.hashBolao
        }));
      }
    });

    // Processar Semifinais (IdFase = 4) - Enviar todas as seleções
    this.semifinais.forEach((jogo, index) => {
      if (jogo.timeA && jogo.timeA.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 4,
          IdSelecao: jogo.timeA.id,
          HashBolao: this.hashBolao
        }));
      }
      if (jogo.timeB && jogo.timeB.id) {
        requests.push(new CriarPalpiteFaseSelecaoRequest({
          IdFase: 4,
          IdSelecao: jogo.timeB.id,
          HashBolao: this.hashBolao
        }));
      }
    });

    // Processar Final (IdFase = 5) - Enviar todas as seleções
    if (this.final.timeA && this.final.timeA.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 5,
        IdSelecao: this.final.timeA.id,
        HashBolao: this.hashBolao
      }));
    }
    if (this.final.timeB && this.final.timeB.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 5,
        IdSelecao: this.final.timeB.id,
        HashBolao: this.hashBolao
      }));
    }

    // Processar Terceiro Lugar (IdFase = 6) - Enviar todas as seleções
    if (this.terceiroLugar.timeA && this.terceiroLugar.timeA.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 6,
        IdSelecao: this.terceiroLugar.timeA.id,
        HashBolao: this.hashBolao
      }));
    }
    if (this.terceiroLugar.timeB && this.terceiroLugar.timeB.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 6,
        IdSelecao: this.terceiroLugar.timeB.id,
        HashBolao: this.hashBolao
      }));
    }

    // Processar Campeão (IdFase = 7) - Enviar somente o campeão
    // No modo clique, usar o vencedor já definido no objeto. No modo formulário, calcular pelo placar
    let vencedorFinal: SelecaoResponse | null = null;
    if (this.modoClicarParaAvancarDeFase) {
      vencedorFinal = this.final.vencedor || null;
    } else {
      const finalFormValue = this.eliminatoriasForm.get('final')?.value;
      if (finalFormValue && finalFormValue.palpiteTimeA !== null && finalFormValue.palpiteTimeB !== null) {
        vencedorFinal = this.determinarVencedorEPerdedor(this.final, finalFormValue).vencedor;
      }
    }
    
    if (vencedorFinal && vencedorFinal.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 7,
        IdSelecao: vencedorFinal.id,
        HashBolao: this.hashBolao
      }));
    }
    
    // Processar Terceiro (IdFase = 8) - Enviar somente o terceiro colocado
    // No modo clique, usar o vencedor já definido no objeto. No modo formulário, calcular pelo placar
    let vencedorTerceiroLugar: SelecaoResponse | null = null;
    if (this.modoClicarParaAvancarDeFase) {
      vencedorTerceiroLugar = this.terceiroLugar.vencedor || null;
    } else {
      const terceiroFormValue = this.eliminatoriasForm.get('terceiroLugar')?.value;
      if (terceiroFormValue && terceiroFormValue.palpiteTimeA !== null && terceiroFormValue.palpiteTimeB !== null) {
        vencedorTerceiroLugar = this.determinarVencedorEPerdedor(this.terceiroLugar, terceiroFormValue).vencedor;
      }
    }
    
    if (vencedorTerceiroLugar && vencedorTerceiroLugar.id) {
      requests.push(new CriarPalpiteFaseSelecaoRequest({
        IdFase: 8,
        IdSelecao: vencedorTerceiroLugar.id,
        HashBolao: this.hashBolao
      }));
    }

    // Enviar todos os palpites para o backend
    if (requests.length > 0) {
      this.palpiteService.palpitarEliminatorias(requests).subscribe({
        next: () => {
          this.toastr.success('Sucesso!', 'Palpites das eliminatórias salvos com sucesso.');
          this.salvar.emit(this.eliminatoriasForm.value);
        },
        error: (error) => {
          console.error('Erro ao salvar palpites:', error);
          this.toastr.error('Erro!', 'Ocorreu um erro ao salvar os palpites das eliminatórias. Tente novamente.');
        }
      });
    } else {
      this.toastr.warning('Atenção!', 'Nenhum palpite para salvar. Selecione os vencedores de cada fase.');
    }
  }

  limparApartirDasOitavas(): void {
    this.dezesseisAvos.forEach(jogo => {
      jogo.vencedor = null;
      jogo.perdedor = null;
      jogo.palpiteTimeA = undefined;
      jogo.palpiteTimeB = undefined;
    });

    const fasesSequenciais: Array<'oitavas' | 'quartas' | 'semifinais'> = ['oitavas', 'quartas', 'semifinais'];

    fasesSequenciais.forEach(fase => {
      const jogos = this[fase] as Jogo[];
      this[fase] = jogos.map(() => ({ timeA: null, timeB: null, vencedor: null, perdedor: null })) as Jogo[];

      const formArray = this.eliminatoriasForm.get(fase) as FormArray | null;
      formArray?.controls.forEach(control => control.reset());
    });

    this.final = { timeA: null, timeB: null, vencedor: null, perdedor: null };
    this.finalFormGroup.reset();

    this.terceiroLugar = { timeA: null, timeB: null, vencedor: null, perdedor: null };
    this.terceiroLugarFormGroup.reset();
  }
}