import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoHComponent } from './grupo-h.component';

describe('GrupoHComponent', () => {
  let component: GrupoHComponent;
  let fixture: ComponentFixture<GrupoHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
