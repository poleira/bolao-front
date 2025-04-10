import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MataMataGridComponent } from './mata-mata-grid.component';

describe('MataMataGridComponent', () => {
  let component: MataMataGridComponent;
  let fixture: ComponentFixture<MataMataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MataMataGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MataMataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
