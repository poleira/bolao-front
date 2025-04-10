import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPaineisComponent } from './lista-paineis.component';

describe('ListaPaineisComponent', () => {
  let component: ListaPaineisComponent;
  let fixture: ComponentFixture<ListaPaineisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPaineisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPaineisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
