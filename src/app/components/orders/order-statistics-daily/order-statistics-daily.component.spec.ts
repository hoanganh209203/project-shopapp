import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatisticsDailyComponent } from './order-statistics-daily.component';

describe('OrderStatisticsDailyComponent', () => {
  let component: OrderStatisticsDailyComponent;
  let fixture: ComponentFixture<OrderStatisticsDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatisticsDailyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStatisticsDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
