import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CholesterolChartComponent } from './cholesterol-chart.component';

describe('CholesterolChartComponent', () => {
  let component: CholesterolChartComponent;
  let fixture: ComponentFixture<CholesterolChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CholesterolChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CholesterolChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
