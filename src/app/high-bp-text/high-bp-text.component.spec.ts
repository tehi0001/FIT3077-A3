import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighBpTextComponent } from './high-bp-text.component';

describe('HighBpTextComponent', () => {
  let component: HighBpTextComponent;
  let fixture: ComponentFixture<HighBpTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighBpTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighBpTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
