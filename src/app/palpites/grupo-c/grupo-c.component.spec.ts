import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCComponent } from './grupo-c.component';

describe('GrupoCComponent', () => {
  let component: GrupoCComponent;
  let fixture: ComponentFixture<GrupoCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
