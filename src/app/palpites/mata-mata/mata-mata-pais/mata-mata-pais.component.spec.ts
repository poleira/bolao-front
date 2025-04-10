import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MataMataPaisComponent } from './mata-mata-pais.component';

describe('MataMataPaisComponent', () => {
  let component: MataMataPaisComponent;
  let fixture: ComponentFixture<MataMataPaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MataMataPaisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MataMataPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
