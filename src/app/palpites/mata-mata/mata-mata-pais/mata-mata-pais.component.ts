import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pais } from 'src/app/palpites/mata-mata/mata-mata-grid/mata-mata-grid.component';

@Component({
  selector: 'app-mata-mata-pais',
  templateUrl: './mata-mata-pais.component.html',
  styleUrls: ['./mata-mata-pais.component.css']
})
export class MataMataPaisComponent implements OnInit {
  @Input() pais: any = undefined;
  @Input() index: Array<number> = [];
  @Output() clicked: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Input() active: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    this.active = true;
    this.clicked.emit(this.index);
  }
}
