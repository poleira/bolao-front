import { Component, Input, OnInit } from '@angular/core';
import { PalpiteService } from '../../palpite.service';
import { JogadorResponse } from 'src/app/shared/models/responses/jogador.response';
import { debounceTime, distinctUntilChanged, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { PalpiteArtilheiroRequest } from 'src/app/shared/models/requests/palpite-artilheiro.request';
import { ToastrService } from 'ngx-toastr';
import { PalpiteArtilheiroResponse } from 'src/app/shared/models/responses/palpite-artilheiro.response';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private palpiteService: PalpiteService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
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
    this.spinner.show('artilheiro');
    this.palpiteService.recuperarPalpiteArtilheiro(this.hashBolao).subscribe({
      next: (palpite: PalpiteArtilheiroResponse) => {
        if (palpite && palpite.jogadorId != 0) {
          this.jogadorSelecionado = palpite.jogadorId;
          this.palpiteService.listarJogadores(palpite.jogadorNome).subscribe(jogadores => {
            this.jogadores$ = merge(of(jogadores), this.jogadoresTypeahead$);
          });
        }
        this.spinner.hide('artilheiro');
      },
      error: (error) => {
        console.error('Erro ao recuperar palpite do artilheiro:', error);
        this.spinner.hide('artilheiro');
      }
    });
  }

  salvarPalpite(): void {
    this.spinner.show('artilheiro');
    this.palpiteService.salvarPalpiteArtilheiro(new PalpiteArtilheiroRequest({ HashBolao: this.hashBolao, JogadorId: this.jogadorSelecionado })).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite artilheiro salvo com sucesso.');
        this.spinner.hide('artilheiro');
      },
      error: (error) => {
        console.log(error);
        console.error('Erro ao salvar palpite do artilheiro:', error);
        this.toastr.error('Erro!', error.error?.erro || 'Ocorreu um erro ao salvar o palpite do artilheiro. Tente novamente.');
        this.spinner.hide('artilheiro');
      }
    });
  }

  // --- Artilheiro do Brasil ---

  recuperarPalpiteBrasil(): void {
    this.spinner.show('artilheiro');
    this.palpiteService.recuperarPalpiteArtilheiroBrasil(this.hashBolao).subscribe({
      next: (palpite: PalpiteArtilheiroResponse) => {
        if (palpite && palpite.jogadorId != 0) {
          this.jogadorBrasilSelecionado = palpite.jogadorId;
          this.palpiteService.listarJogadoresBrasil(palpite.jogadorNome).subscribe(jogadores => {
            this.jogadoresBrasil$ = merge(of(jogadores), this.jogadoresBrasilTypeahead$);
          });
        }
        this.spinner.hide('artilheiro');
      },
      error: (error) => {
        console.error('Erro ao recuperar palpite do artilheiro do Brasil:', error);
        this.spinner.hide('artilheiro');
      }
    });
  }

  salvarPalpiteBrasil(): void {
    this.spinner.show('artilheiro');
    this.palpiteService.salvarPalpiteArtilheiroBrasil(new PalpiteArtilheiroRequest({ HashBolao: this.hashBolao, JogadorId: this.jogadorBrasilSelecionado })).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite artilheiro do Brasil salvo com sucesso.');
        this.spinner.hide('artilheiro');
      },
      error: (error) => {
        console.error('Erro ao salvar palpite do artilheiro do Brasil:', error);
        this.toastr.error('Erro!', error.error?.erro || 'Ocorreu um erro ao salvar o palpite do artilheiro do Brasil. Tente novamente.');
        this.spinner.hide('artilheiro');
      }
    });
  }
}
