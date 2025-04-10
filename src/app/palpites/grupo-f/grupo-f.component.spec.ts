import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoFComponent } from './grupo-f.component';

describe('GrupoFComponent', () => {
  let component: GrupoFComponent;
  let fixture: ComponentFixture<GrupoFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
