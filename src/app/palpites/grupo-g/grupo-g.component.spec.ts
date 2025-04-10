import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoGComponent } from './grupo-g.component';

describe('GrupoGComponent', () => {
  let component: GrupoGComponent;
  let fixture: ComponentFixture<GrupoGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
