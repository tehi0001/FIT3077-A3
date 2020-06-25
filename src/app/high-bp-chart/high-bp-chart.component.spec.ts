import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighBpChartComponent } from './high-bp-chart.component';

describe('HighBpChartComponent', () => {
  let component: HighBpChartComponent;
  let fixture: ComponentFixture<HighBpChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighBpChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighBpChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
