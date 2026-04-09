import { Component, Input, OnInit } from '@angular/core';
import { PalpiteService } from '../../palpite.service';
import { JogadorResponse } from 'src/app/shared/models/responses/jogador.response';
import { debounceTime, distinctUntilChanged, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { PalpiteArtilheiroRequest } from 'src/app/shared/models/requests/palpite-artilheiro.request';
import { ToastrService } from 'ngx-toastr';
import { PalpiteArtilheiroResponse } from 'src/app/shared/models/responses/palpite-artilheiro.response';

@Component({
  selector: 'app-artilheiro-accordion',
  templateUrl: './artilheiro-accordion.component.html',
  styleUrls: ['./artilheiro-accordion.component.css']
})
export class ArtilheiroAccordionComponent implements OnInit {
  // Artilheiro Geral
  inputBusca$ = new Subject<string>();
  jogadores$!: Observable<JogadorResponse[]>;
  jogadorSelecionado!: number;
  private readonly jogadoresTypeahead$: Observable<JogadorResponse[]>;

  // Artilheiro do Brasil
  inputBuscaBrasil$ = new Subject<string>();
  jogadoresBrasil$!: Observable<JogadorResponse[]>;
  jogadorBrasilSelecionado!: number;
  private readonly jogadoresBrasilTypeahead$: Observable<JogadorResponse[]>;

  @Input() hashBolao: string = "string";
  @Input() regras: string[] = [];

  constructor(private palpiteService: PalpiteService, private toastr: ToastrService) {
    this.jogadoresTypeahead$ = this.inputBusca$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.palpiteService.listarJogadores(term))
    );
    this.jogadores$ = this.jogadoresTypeahead$;

    this.jogadoresBrasilTypeahead$ = this.inputBuscaBrasil$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.palpiteService.listarJogadoresBrasil(term))
    );
    this.jogadoresBrasil$ = this.jogadoresBrasilTypeahead$;
  }

  ngOnInit(): void {
    this.recuperarPalpite();
    this.recuperarPalpiteBrasil();
  }

  // --- Artilheiro Geral ---

  recuperarPalpite(): void {
    this.palpiteService.recuperarPalpiteArtilheiro(this.hashBolao).subscribe({
      next: (palpite: PalpiteArtilheiroResponse) => {
        if (palpite && palpite.jogadorId != 0) {
          this.jogadorSelecionado = palpite.jogadorId;
          this.palpiteService.listarJogadores(palpite.jogadorNome).subscribe(jogadores => {
            this.jogadores$ = merge(of(jogadores), this.jogadoresTypeahead$);
          });
        }
      },
      error: (error) => {
        console.error('Erro ao recuperar palpite do artilheiro:', error);
      }
    });
  }

  salvarPalpite(): void {
    if (!this.jogadorSelecionado) {
      this.toastr.warning('Selecione um jogador antes de salvar.', 'Atenção');
      return;
    }
    this.palpiteService.salvarPalpiteArtilheiro(new PalpiteArtilheiroRequest({ HashBolao: this.hashBolao, JogadorId: this.jogadorSelecionado })).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite artilheiro salvo com sucesso.');
      },
      error: (error) => {
        console.log(error);
        console.error('Erro ao salvar palpite do artilheiro:', error);
        this.toastr.error('Erro!', error.error?.erro || 'Ocorreu um erro ao salvar o palpite do artilheiro. Tente novamente.');
      }
    });
  }

  // --- Artilheiro do Brasil ---

  recuperarPalpiteBrasil(): void {
    this.palpiteService.recuperarPalpiteArtilheiroBrasil(this.hashBolao).subscribe({
      next: (palpite: PalpiteArtilheiroResponse) => {
        if (palpite && palpite.jogadorId != 0) {
          this.jogadorBrasilSelecionado = palpite.jogadorId;
          this.palpiteService.listarJogadoresBrasil(palpite.jogadorNome).subscribe(jogadores => {
            this.jogadoresBrasil$ = merge(of(jogadores), this.jogadoresBrasilTypeahead$);
          });
        }
      },
      error: (error) => {
        console.error('Erro ao recuperar palpite do artilheiro do Brasil:', error);
      }
    });
  }

  salvarPalpiteBrasil(): void {
    if (!this.jogadorBrasilSelecionado) {
      this.toastr.warning('Selecione um jogador antes de salvar.', 'Atenção');
      return;
    }
    this.palpiteService.salvarPalpiteArtilheiroBrasil(new PalpiteArtilheiroRequest({ HashBolao: this.hashBolao, JogadorId: this.jogadorBrasilSelecionado })).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite artilheiro do Brasil salvo com sucesso.');
      },
      error: (error) => {
        console.error('Erro ao salvar palpite do artilheiro do Brasil:', error);
        this.toastr.error('Erro!', error.error?.erro || 'Ocorreu um erro ao salvar o palpite do artilheiro do Brasil. Tente novamente.');
      }
    });
  }
}
