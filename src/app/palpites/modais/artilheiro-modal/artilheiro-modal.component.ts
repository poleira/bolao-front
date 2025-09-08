import { Component, Input, OnInit } from '@angular/core';
import { PalpiteService } from '../../palpite.service';
import { JogadorResponse } from 'src/app/shared/models/responses/jogador.response';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { PalpiteArtilheiroRequest } from 'src/app/shared/models/requests/palpite-artilheiro.request';
import { ToastrService } from 'ngx-toastr';
import { PalpiteArtilheiroResponse } from 'src/app/shared/models/responses/palpite-artilheiro.response';

@Component({
  selector: 'app-artilheiro-modal',
  templateUrl: './artilheiro-modal.component.html',
  styleUrls: ['./artilheiro-modal.component.css']
})
export class ArtilheiroModalComponent implements OnInit {
  inputBusca$ = new Subject<string>();
  jogadores$!: Observable<JogadorResponse[]>;
  jogadorSelecionado!: number;
  @Input() hashBolao: string = "string";

  constructor(private palpiteService: PalpiteService, private toastr: ToastrService) {
  this.jogadores$ = this.inputBusca$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.listarJogadores(term))
  );
  }

  recuperarPalpite() {
  this.palpiteService.recuperarPalpiteArtilheiro(this.hashBolao).subscribe({
    next: (palpite: PalpiteArtilheiroResponse) => {
      if (palpite && palpite.jogadorId != 0)
        {
          this.jogadorSelecionado = palpite.jogadorId;
          
          this.palpiteService.listarJogadores(palpite.jogadorNome).subscribe(jogadores => {
            this.jogadores$ = of(jogadores); 
          });
        }
    },
    error: (error) => {
      console.error('Erro ao recuperar palpite do artilheiro:', error);
    }
  });
}


  listarJogadores(nome: string): Observable<JogadorResponse[]> {
    return this.palpiteService.listarJogadores(nome);
  }

  ngOnInit(): void {
    this.recuperarPalpite();
  }

  salvarPalpite() {
    this.palpiteService.salvarPalpiteArtilheiro(new PalpiteArtilheiroRequest({HashBolao: this.hashBolao, JogadorId: this.jogadorSelecionado})).subscribe({
      next: () => {
        this.toastr.success('Sucesso!', 'Palpite artilheiro salvo com sucesso.');
      },
      error: (error) => {
        console.error('Erro ao salvar palpite do artilheiro:', error);
        this.toastr.error('Erro!', 'Ocorreu um erro ao salvar o palpite do artilheiro. Tente novamente.');
      }
    });
  }


}
