import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JogoBRComponent } from './jogo-br.component';

describe('JogoBRComponent', () => {
  let component: JogoBRComponent;
  let fixture: ComponentFixture<JogoBRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JogoBRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JogoBRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
