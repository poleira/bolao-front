import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoAComponent } from './grupo-a.component';

describe('GrupoAComponent', () => {
  let component: GrupoAComponent;
  let fixture: ComponentFixture<GrupoAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
