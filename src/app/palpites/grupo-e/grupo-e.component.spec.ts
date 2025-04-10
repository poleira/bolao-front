import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoEComponent } from './grupo-e.component';

describe('GrupoEComponent', () => {
  let component: GrupoEComponent;
  let fixture: ComponentFixture<GrupoEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoEComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
