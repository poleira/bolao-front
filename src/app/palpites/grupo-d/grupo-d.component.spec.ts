import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDComponent } from './grupo-d.component';

describe('GrupoDComponent', () => {
  let component: GrupoDComponent;
  let fixture: ComponentFixture<GrupoDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
